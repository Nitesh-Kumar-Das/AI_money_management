# Flask API Server for AI Budget ML Model Integration
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from ai_budget_ml_model import AIBudgetManager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

ai_budget = AIBudgetManager()

try:
    logger.info("🚀 Training AI Budget Model on startup...")
    ai_budget.train_models()
    logger.info("✅ AI Budget Model trained successfully")
except Exception as e:
    logger.error(f"❌ Failed to train model: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_trained': ai_budget.is_trained,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict-spending', methods=['POST'])
def predict_spending():
    try:
        data = request.get_json()
        
        required_fields = ['user_income', 'user_age', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if 'month' not in data:
            data['month'] = datetime.now().month
        
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
    try:
        data = request.get_json()
        
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
    try:
        data = request.get_json()
        
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
    try:
        data = request.get_json()
        
        required_fields = ['user_income', 'user_age']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
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
    try:
        data = request.get_json()
        
        required_fields = ['user_data', 'current_budget', 'total_budget']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        user_data = data['user_data']
        current_budget = data['current_budget']
        total_budget = data['total_budget']
        
        predictions = {}
        for category in ai_budget.categories:
            prediction_data = {**user_data, 'category': category}
            prediction = ai_budget.predict_spending(prediction_data)
            if prediction:
                predictions[category] = prediction['predicted_amount']
        
        optimized_budget = {}
        total_predicted = sum(predictions.values())
        
        if total_predicted > 0:
            for category, predicted_amount in predictions.items():
                proportion = predicted_amount / total_predicted
                optimized_budget[category] = round(total_budget * proportion, 2)
        
        savings_opportunities = []
        for category, current_amount in current_budget.items():
            predicted_amount = predictions.get(category, current_amount)
            if current_amount > predicted_amount * 1.2:
                potential_savings = current_amount - (predicted_amount * 1.1)
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
    try:
        data = request.get_json()
        
        if 'expenses' not in data:
            return jsonify({'error': 'Missing expenses data'}), 400
        
        expenses = data['expenses']
        
        seasonal_data = {}
        monthly_totals = {}
        
        for expense in expenses:
            expense_date = datetime.fromisoformat(expense['date'])
            month = expense_date.month
            
            if month not in monthly_totals:
                monthly_totals[month] = 0
            monthly_totals[month] += expense['amount']
        
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
    try:
        data = request.get_json()
        
        if 'training_data' in data:
            training_df = pd.DataFrame(data['training_data'])
            training_results = ai_budget.train_models(training_df)
        else:
            training_results = ai_budget.train_models()
        
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
    import os
    port = int(os.environ.get('PORT', 8000))
    
    print("🚀 Starting AI Budget ML API Server...")
    print("📊 Model training complete!")
    print(f"🌐 API endpoints available at http://0.0.0.0:{port}")
    print("   • Health Check: /health")
    print("   • Model Stats: /api/model-stats")
    print("   • Predict Spending: /api/predict-spending")
    print("   • Smart Insights: /api/smart-insights")
    print("   • And more... check /api/model-stats for full list")
    
    app.run(debug=False, port=port, host='0.0.0.0')
