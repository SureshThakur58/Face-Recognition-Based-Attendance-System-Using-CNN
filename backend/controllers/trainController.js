const axios = require('axios');

exports.trainModel = async (req, res) => {
    try {
        // Send a POST request to FastAPI to start training
        const response = await axios.post('http://localhost:8000/train-model');
        res.status(200).json({
            message: 'Model training done successfully'
        });
    } catch (error) {
        console.error('Error in training model:', error.response ? error.response.data : error.message);
        return res.status(500).json({
            message: 'Error initiating model training from Node.js',
            details: error.response ? error.response.data : error.message,
        });
    }
};
