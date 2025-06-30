# Flask API Server for AI Budget ML Model Integration
# This server provides REST APIs to integrate the ML model with the Next.js frontend

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from ai_budget_ml_model import AIBudgetManager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js integration

# Initialize AI Budget Manager
ai_budget = AIBudgetManager()

# Train the model on startup
try:
    logger.info("🚀 Training AI Budget Model on startup...")
    ai_budget.train_models()
    logger.info("✅ AI Budget Model trained successfully")
except Exception as e:
    logger.error(f"❌ Failed to train model: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_trained': ai_budget.is_trained,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict-spending', methods=['POST'])
def predict_spending():
    """Predict future spending for a user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_income', 'user_age', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add current month if not provided
        if 'month' not in data:
            data['month'] = datetime.now().month
        
        # Get prediction
        prediction = ai_budget.predict_spending(data)
        
        if prediction is None:
            return jsonify({'error': 'Model not trained'}), 500
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in predict_spending: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/detect-anomalies', methods=['POST'])
def detect_anomalies():
    """Detect spending anomalies"""
    try:
        data = request.get_json()
        
        if 'expenses' not in data:
            return jsonify({'error': 'Missing expenses data'}), 400
        
        expenses = data['expenses']
        anomalies = ai_budget.detect_anomalies(expenses)
        
        return jsonify({
            'success': True,
            'anomalies': anomalies,
            'count': len(anomalies),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in detect_anomalies: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget-recommendations', methods=['POST'])
def get_budget_recommendations():
    """Generate budget recommendations"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_data', 'historical_expenses']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_data = data['user_data']
        historical_expenses = data['historical_expenses']
        
        recommendations = ai_budget.generate_budget_recommendations(user_data, historical_expenses)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in get_budget_recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/spending-trends', methods=['POST'])
def analyze_spending_trends():
    """Analyze spending trends"""
    try:
        data = request.get_json()
        
        if 'expenses' not in data:
            return jsonify({'error': 'Missing expenses data'}), 400
        
        expenses = data['expenses']
        trends = ai_budget.analyze_spending_trends(expenses)
        
        return jsonify({
            'success': True,
            'trends': trends,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in analyze_spending_trends: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/smart-insights', methods=['POST'])
def get_smart_insights():
    """Get comprehensive smart insights"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_data', 'expenses']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_data = data['user_data']
        expenses = data['expenses']
        budget_goals = data.get('budget_goals', None)
        
        insights = ai_budget.get_smart_insights(user_data, expenses, budget_goals)
        
        return jsonify({
            'success': True,
            'insights': insights,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in get_smart_insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/category-predictions', methods=['POST'])
def get_category_predictions():
    """Get predictions for all categories"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_income', 'user_age']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Get predictions for all categories
        predictions = {}
        for category in ai_budget.categories:
            prediction_data = {**data, 'category': category}
            prediction = ai_budget.predict_spending(prediction_data)
            if prediction:
                predictions[category] = prediction
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'categories': ai_budget.categories,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in get_category_predictions: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/budget-optimization', methods=['POST'])
def optimize_budget():
    """Optimize budget allocation"""
    try:
        data = request.get_json()
        
        required_fields = ['user_data', 'current_budget', 'total_budget']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_data = data['user_data']
        current_budget = data['current_budget']
        total_budget = data['total_budget']
        
        # Get predictions for all categories
        predictions = {}
        for category in ai_budget.categories:
            prediction_data = {**user_data, 'category': category}
            prediction = ai_budget.predict_spending(prediction_data)
            if prediction:
                predictions[category] = prediction['predicted_amount']
        
        # Optimize budget allocation
        optimized_budget = {}
        total_predicted = sum(predictions.values())
        
        if total_predicted > 0:
            # Proportionally allocate budget based on predictions
            for category, predicted_amount in predictions.items():
                proportion = predicted_amount / total_predicted
                optimized_budget[category] = round(total_budget * proportion, 2)
        
        # Calculate savings opportunities
        savings_opportunities = []
        for category, current_amount in current_budget.items():
            predicted_amount = predictions.get(category, current_amount)
            if current_amount > predicted_amount * 1.2:  # 20% buffer
                potential_savings = current_amount - (predicted_amount * 1.1)  # 10% buffer
                savings_opportunities.append({
                    'category': category,
                    'current_budget': current_amount,
                    'recommended_budget': predicted_amount * 1.1,
                    'potential_savings': potential_savings,
                    'confidence': 'medium'
                })
        
        return jsonify({
            'success': True,
            'optimized_budget': optimized_budget,
            'predictions': predictions,
            'savings_opportunities': savings_opportunities,
            'total_savings': sum([s['potential_savings'] for s in savings_opportunities]),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in optimize_budget: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/seasonal-analysis', methods=['POST'])
def seasonal_analysis():
    """Analyze seasonal spending patterns"""
    try:
        data = request.get_json()
        
        if 'expenses' not in data:
            return jsonify({'error': 'Missing expenses data'}), 400
        
        expenses = data['expenses']
        
        # Analyze seasonal patterns
        seasonal_data = {}
        monthly_totals = {}
        
        for expense in expenses:
            expense_date = datetime.fromisoformat(expense['date'])
            month = expense_date.month
            
            if month not in monthly_totals:
                monthly_totals[month] = 0
            monthly_totals[month] += expense['amount']
        
        # Calculate seasonal multipliers
        if monthly_totals:
            average_monthly = sum(monthly_totals.values()) / len(monthly_totals)
            
            for month in range(1, 13):
                actual_spending = monthly_totals.get(month, 0)
                multiplier = actual_spending / average_monthly if average_monthly > 0 else 1
                
                seasonal_data[month] = {
                    'month_name': datetime(2025, month, 1).strftime('%B'),
                    'actual_spending': actual_spending,
                    'seasonal_multiplier': multiplier,
                    'vs_average': ((actual_spending - average_monthly) / average_monthly * 100) if average_monthly > 0 else 0
                }
        
        # Generate seasonal recommendations
        recommendations = []
        current_month = datetime.now().month
        
        for month in range(current_month, min(current_month + 3, 13)):
            month_data = seasonal_data.get(month, {})
            if month_data.get('seasonal_multiplier', 1) > 1.2:
                recommendations.append({
                    'month': month_data.get('month_name', ''),
                    'message': f"Higher spending expected in {month_data.get('month_name', '')}. Consider saving extra in advance.",
                    'multiplier': month_data.get('seasonal_multiplier', 1)
                })
        
        return jsonify({
            'success': True,
            'seasonal_data': seasonal_data,
            'recommendations': recommendations,
            'average_monthly_spending': average_monthly if monthly_totals else 0,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in seasonal_analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/retrain-model', methods=['POST'])
def retrain_model():
    """Retrain the model with new data"""
    try:
        data = request.get_json()
        
        # If custom training data is provided, use it
        if 'training_data' in data:
            training_df = pd.DataFrame(data['training_data'])
            training_results = ai_budget.train_models(training_df)
        else:
            # Retrain with generated data
            training_results = ai_budget.train_models()
        
        # Save the updated model
        ai_budget.save_model('ai_budget_model_updated.pkl')
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'training_results': training_results,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Error in retrain_model: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/model-stats', methods=['GET'])
def get_model_stats():
    """Get model statistics and information"""
    return jsonify({
        'success': True,
        'model_info': {
            'is_trained': ai_budget.is_trained,
            'categories': ai_budget.categories,
            'seasonal_multipliers': ai_budget.seasonal_multipliers,
            'model_type': 'RandomForestRegressor',
            'features': [
                'month', 'quarter', 'day_of_week', 'is_weekend',
                'user_income', 'user_age', 'risk_tolerance', 'category',
                'prev_month_spending', 'avg_3month_spending'
            ]
        },
        'endpoints': [
            '/api/predict-spending',
            '/api/detect-anomalies',
            '/api/budget-recommendations',
            '/api/spending-trends',
            '/api/smart-insights',
            '/api/category-predictions',
            '/api/budget-optimization',
            '/api/seasonal-analysis'
        ],
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting AI Budget ML API Server...")
    print("📊 Model training complete!")
    print("🌐 API endpoints available at:")
    print("   • Health Check: http://localhost:5000/health")
    print("   • Model Stats: http://localhost:5000/api/model-stats")
    print("   • Predict Spending: http://localhost:5000/api/predict-spending")
    print("   • Smart Insights: http://localhost:5000/api/smart-insights")
    print("   • And more... check /api/model-stats for full list")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
