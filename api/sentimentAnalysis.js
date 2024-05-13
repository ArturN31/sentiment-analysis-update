const assignLexicalDualityFlag = (naturalScore, vaderScore) => {
    //flag to indicate significant score difference
    let lexicalDualityFlag = false;

    //handle lexical duality (investigate text, external resources, etc.)
    if (Math.abs(naturalScore - vaderScore) > 0.3) lexicalDualityFlag = true;

    return lexicalDualityFlag ?
        `There is a significant difference between the sentiment scores from the Natural Language Analyser (NLA) and Vader, potentially indicating lexical duality (e.g., sarcasm, mixed emotions). We recommend reviewing the text for potential ambiguity.` : '';
}

const assignSentimentWeights = (naturalScore, vaderScore, purpose) => {
    //absolute sentiment distance between NLA and Vader scores
    const sentimentDistance = Math.abs(naturalScore - vaderScore);
    //threshold for considering scores neutral
    const neutralThreshold = 0.1;

    //sentiment strength based on score magnitudes - scores above 0.7 are considered strong
    const strongSentimentThreshold = 0.7;
    const isStrongSentiment = Math.abs(naturalScore) >= strongSentimentThreshold || Math.abs(vaderScore) >= strongSentimentThreshold;

    const getSentimentLeaning = (score, dominantScore) => {
        const absoluteScore = Math.abs(score);

        //prioritise dominant score for scores near neutral threshold
        if (absoluteScore < neutralThreshold) {
            return dominantScore < 0 ? 'negative' : 'positive';
        } else {
            //use the score's own sign for sentiment direction
            return score < 0 ? 'negative' : 'positive';
        }
    };

    //sentiment direction for NLA and Vader scores - positive/negative
    const naturalSentimentDirection = getSentimentLeaning(naturalScore);
    const vaderSentimentDirection = getSentimentLeaning(vaderScore);

    const getDominantScore = () => {
        if (purpose === 'news') {
            //prioritise Vader score for news analysis
            return Math.abs(vaderScore) > Math.abs(naturalScore) ? vaderScore : naturalScore;
        } else {
            //user-generated text (prioritise negativity)
            return naturalScore < 0 || (naturalScore === 0 && vaderScore < 0) ? naturalScore : vaderScore;
        }
    };

    const dominantScore = getDominantScore();
    const dominantScoreLabel = dominantScore === naturalScore ? 'NLA score' : 'Vader score';
    const weakerScore = dominantScore === naturalScore ? vaderScore : naturalScore;
    const weakerScoreLabel = dominantScoreLabel === 'NLA score' ? 'Vader score' : 'NLA score';
    const dominantSentiment = dominantScore < 0 ? 'negative' : 'positive';

    const sentimentMessage = sentimentDistance <= 0.1
        ? `The NLA score and Vader score are in close agreement (NLA: ${naturalScore.toFixed(2)}, Vader: ${vaderScore.toFixed(2)}), indicating a ${isStrongSentiment ? 'strong' : 'weaker'} ${dominantSentiment} sentiment.`
        : `The ${dominantScoreLabel} (dominant: ${dominantScore.toFixed(2)}) indicates ${dominantSentiment} sentiment, and the ${weakerScoreLabel} (weaker: ${Math.abs(weakerScore).toFixed(2)}) indicates ${naturalSentimentDirection} sentiment.`;

    const sentimentConflict = naturalSentimentDirection !== dominantSentiment;

    //weight calculation logic based on sentiment distance, purpose, and conflict
    const baseWeight = 0.5;
    const distanceImpact = 1 - sentimentDistance; //higher distance reduces weight
    const conflictImpact = sentimentConflict ? 0.8 : 1; //reduce weight for conflicting sentiment
    const purposeImpact = {
        news: 1,
        user_generated: {
            positive: 0.8, //reduce weight for positive sentiment in user-generated content
            negative: 1.2, //increase weight for negative sentiment in user-generated content
        },
    };

    let naturalWeight = baseWeight * distanceImpact * conflictImpact * purposeImpact[purpose];
    let vaderWeight = 1 - naturalWeight;

    //adjust weights for scores near neutral threshold, prioritising sentiment direction
    if (Math.abs(naturalScore) < neutralThreshold) {
        naturalWeight = naturalSentimentDirection === 'neutral' ? 0.5 : naturalWeight;
    }
    if (Math.abs(vaderScore) < neutralThreshold) {
        vaderWeight = vaderSentimentDirection === 'neutral' ? 0.5 : vaderWeight;
    }

    return {
        sentimentMessage,
        sentimentDistance,
        naturalWeight,
        vaderWeight,
    };
};

const assignSentimentConfidence = (sentimentDistance) => {
    //confidence based on distance with adjusted weight for larger distances
    const confidenceWeight = Math.max(0, 1 - Math.pow(Math.abs(sentimentDistance), 2));
    const confidenceScorePercentage = Math.round(confidenceWeight * 100);

    //confidence Score Ranges with labels (expanded range)
    const confidenceLabels = {
        "0": "Very Low Confidence",
        "0.25": "Low Confidence",
        "0.5": "Moderate Confidence",
        "0.75": "High Confidence",
        "1.0": "Very High Confidence"
    };

    //ensure confidence score is within valid range (0-1)
    const clampedScore = Math.max(0, Math.min(confidenceScorePercentage / 100, 1));

    //use Math.floor to round down for more accurate label assignment
    const confidenceLabelIndex = Math.floor(clampedScore * (Object.keys(confidenceLabels).length - 1));

    //get confidence label from index
    const confidenceLabel = confidenceLabels[Object.keys(confidenceLabels)[confidenceLabelIndex]] || "Unknown Confidence";

    return `Confidence in this analysis is ${confidenceScorePercentage}% (${confidenceLabel}).`;
};

const categoriseSentiment = (naturalScore, vaderScore, combinedScore, purpose) => {
    //object containing the score thresholds for each sentiment category
    const sentimentCategories = {
        news: {
            'very positive': { lowerThreshold: 0.6, upperThreshold: 1 },
            positive: { lowerThreshold: 0.4, upperThreshold: 0.6 },
            'slightly positive': { lowerThreshold: 0.1, upperThreshold: 0.4 },
            neutral: { lowerThreshold: -0.1, upperThreshold: 0.1 },
            'slightly negative': { lowerThreshold: -0.4, upperThreshold: -0.1 },
            negative: { lowerThreshold: -0.6, upperThreshold: -0.4 },
            'very negative': { lowerThreshold: -1, upperThreshold: -0.6 },
        },
        userText: {
            'very positive': { lowerThreshold: 0.7, upperThreshold: 1 },
            positive: { lowerThreshold: 0.4, upperThreshold: 0.7 },
            'slightly positive': { lowerThreshold: 0.1, upperThreshold: 0.4 },
            neutral: { lowerThreshold: -0.1, upperThreshold: 0.1 },
            'slightly negative': { lowerThreshold: -0.5, upperThreshold: -0.1 },
            negative: { lowerThreshold: -0.8, upperThreshold: -0.5 },
            'very negative': { lowerThreshold: -1, upperThreshold: -0.8 },
        },
    };

    //object containing emotions and intensity for each sentiment category
    const sentimentData = {
        'very positive': {
            emotion: ['elation', 'exhilaration', 'delight', 'enthusiasm', 'gratitude'],
            intensity: 'strongly positive',
        },
        positive: {
            emotion: ['happiness', 'contentment', 'optimism', 'satisfaction', 'hope'],
            intensity: 'moderately positive',
        },
        'slightly positive': {
            emotion: ['pleasure', 'interest', 'cheerfulness', 'amusement', 'relief'],
            intensity: 'weakly positive',
        },
        neutral: {
            emotion: ['equanimity', 'objectivity', 'detachment', 'calmness', 'acceptance'],
            intensity: 'neutral',
        },
        'slightly negative': {
            emotion: ['disappointment', 'worry', 'pessimism', 'concern', 'doubt'],
            intensity: 'weakly negative',
        },
        negative: {
            emotion: ['sadness', 'frustration', 'anger', 'regret', 'resentment'],
            intensity: 'moderately negative',
        },
        'very negative': {
            emotion: ['despair', 'grief', 'rage', 'helplessness', 'bitterness'],
            intensity: 'strongly negative',
        },
    };

    //check if user text and apply appropriate thresholds
    const contextThresholds = purpose === 'user' ? sentimentCategories.userText : sentimentCategories.news;

    const lexicalDualityFlagOutput = assignLexicalDualityFlag(naturalScore, vaderScore);
    const sentimentWeightsOutput = assignSentimentWeights(naturalScore, vaderScore, purpose)
    const confidenceOutput = assignSentimentConfidence(sentimentWeightsOutput.sentimentDistance);

    let sentimentCategory, sentimentScore;

    //prioritise agreement between Natural and Vader scores for stronger confidence
    if (Math.abs(naturalScore - vaderScore) <= 0.2) {
        //if difference between scores is <= 0.2
        //consider them to be in agreement and use their average for sentiment categorisation
        const averageScore = (naturalScore + vaderScore) / 2;

        for (const category in contextThresholds) {
            const { lowerThreshold, upperThreshold } = contextThresholds[category];
            if (averageScore >= lowerThreshold && averageScore < upperThreshold) {
                sentimentCategory = category;
                sentimentScore = averageScore;
                break;
            }
        }
    } else {
        const weightedScore = (naturalScore * sentimentWeightsOutput.naturalWeight) + (vaderScore * sentimentWeightsOutput.vaderWeight);

        //use combined score as a fallback
        sentimentScore = combinedScore;

        //categorise sentiment based on weighted score or combined score
        for (const category in contextThresholds) {
            const { lowerThreshold, upperThreshold } = contextThresholds[category];
            if ((weightedScore >= lowerThreshold && weightedScore < upperThreshold) ||
                (sentimentScore >= lowerThreshold && sentimentScore < upperThreshold)) {
                sentimentCategory = category;
                break;
            }
        }
    }

    let categoryData = sentimentData[sentimentCategory];

    return {
        sentiment: sentimentCategory,
        description: [
            //sentiment and score
            `Our analysis suggests a ${sentimentCategory.toLowerCase()} sentiment with a score of ${combinedScore.toFixed(2)}.`,

            //emotions and intensity
            categoryData ? (
                `The text evokes emotions associated with ${categoryData.emotion.join(', ')}. ${categoryData.intensity ? `It has a ${categoryData.intensity.toLowerCase()} impact on the reader.` : ''}`
            ) : '',

            //confidence score with label
            confidenceOutput,

            //lexical duality flag
            lexicalDualityFlagOutput,

            //explains the weight assignment based on score agreement.
            sentimentWeightsOutput.sentimentMessage
        ],
    };
};

module.exports = {
    categoriseSentiment,
}