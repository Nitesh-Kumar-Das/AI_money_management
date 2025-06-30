# AI Budget Management ML Model
# This model provides intelligent budget recommendations, spending predictions, and financial insights

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class AIBudgetManager:
    def __init__(self):
        """Initialize the AI Budget Manager with ML models"""
        self.spending_predictor = RandomForestRegressor(n_estimators=100, random_state=42)
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.trend_analyzer = LinearRegression()
        self.category_encoder = LabelEncoder()
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = []  # Store feature names for consistency
        
        # Budget categories
        self.categories = [
            'food', 'transport', 'shopping', 'entertainment', 'utilities',
            'healthcare', 'education', 'travel', 'business', 'other'
        ]
        
        # Seasonal patterns
        self.seasonal_multipliers = {
            1: 0.9,   # January - post-holiday savings
            2: 0.95,  # February
            3: 1.0,   # March - baseline
            4: 1.05,  # April - spring activities
            5: 1.1,   # May - outdoor activities
            6: 1.15,  # June - summer start
            7: 1.2,   # July - peak summer
            8: 1.15,  # August - still summer
            9: 1.0,   # September - back to school
            10: 1.05, # October - holiday prep
            11: 1.3,  # November - Black Friday, Thanksgiving
            12: 1.4   # December - Christmas, New Year
        }
    
    def generate_sample_data(self, num_users=100, num_months=12):
        """Generate realistic sample expense data for training"""
        print("🔄 Generating sample training data...")
        
        data = []
        base_date = datetime.now() - timedelta(days=365)
        
        for user_id in range(1, num_users + 1):
            # User characteristics
            user_income = np.random.normal(5000, 1500)  # Monthly income
            user_age = np.random.randint(18, 65)
            user_risk_tolerance = np.random.choice(['low', 'medium', 'high'])
            
            for month in range(num_months):
                current_date = base_date + timedelta(days=30 * month)
                month_num = current_date.month
                
                # Generate expenses for each category
                for category in self.categories:
                    # Base spending amount based on category
                    base_amounts = {
                        'food': 400, 'transport': 200, 'shopping': 300,
                        'entertainment': 150, 'utilities': 200, 'healthcare': 100,
                        'education': 50, 'travel': 100, 'business': 75, 'other': 100
                    }
                    
                    base_amount = base_amounts.get(category, 100)
                    
                    # Apply seasonal multiplier
                    seasonal_amount = base_amount * self.seasonal_multipliers[month_num]
                    
                    # Add user-specific variation
                    income_factor = user_income / 5000  # Normalize to median income
                    age_factor = 1 + (user_age - 40) / 100  # Age affects spending
                    
                    # Generate monthly spending with realistic variation
                    monthly_spending = seasonal_amount * income_factor * age_factor
                    monthly_spending *= np.random.normal(1, 0.3)  # Add randomness
                    monthly_spending = max(0, monthly_spending)  # No negative spending
                    
                    # Generate number of transactions
                    num_transactions = max(1, int(np.random.poisson(10)))
                    
                    data.append({
                        'user_id': user_id,
                        'date': current_date,
                        'month': month_num,
                        'category': category,
                        'amount': monthly_spending,
                        'num_transactions': num_transactions,
                        'user_income': user_income,
                        'user_age': user_age,
                        'user_risk_tolerance': user_risk_tolerance,
                        'day_of_week': current_date.weekday(),
                        'is_weekend': current_date.weekday() >= 5,
                        'quarter': (month_num - 1) // 3 + 1
                    })
        
        df = pd.DataFrame(data)
        print(f"✅ Generated {len(df)} expense records for training")
        return df
    
    def prepare_features(self, df):
        """Prepare features for machine learning models"""
        print("🔄 Preparing features for ML models...")
        
        # Create feature matrix
        features = pd.DataFrame()
        
        # Time-based features
        features['month'] = df['month']
        features['quarter'] = df['quarter']
        features['day_of_week'] = df['day_of_week']
        features['is_weekend'] = df['is_weekend'].astype(int)
        
        # User features
        features['user_income'] = df['user_income']
        features['user_age'] = df['user_age']
        
        # Encode categorical variables
        risk_tolerance_encoded = pd.get_dummies(df['user_risk_tolerance'], prefix='risk')
        category_encoded = pd.get_dummies(df['category'], prefix='cat')
        
        features = pd.concat([features, risk_tolerance_encoded, category_encoded], axis=1)
        
        # Historical spending features (rolling averages)
        df_sorted = df.sort_values(['user_id', 'date'])
        features['prev_month_spending'] = df_sorted.groupby(['user_id', 'category'])['amount'].shift(1).fillna(0)
        features['avg_3month_spending'] = df_sorted.groupby(['user_id', 'category'])['amount'].rolling(3).mean().fillna(0).values
        
        # Target variable
        target = df['amount']
        
        # Store feature names for consistency in predictions
        self.feature_names = list(features.columns)
        
        print(f"✅ Prepared {features.shape[1]} features")
        return features, target
    
    def train_models(self, df=None):
        """Train all ML models with expense data"""
        print("🚀 Starting AI Budget Manager training...")
        
        if df is None:
            df = self.generate_sample_data()
        
        # Prepare features
        X, y = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print("🔄 Training spending prediction model...")
        # Train spending predictor
        self.spending_predictor.fit(X_train_scaled, y_train)
        
        print("🔄 Training anomaly detection model...")
        # Train anomaly detector
        self.anomaly_detector.fit(X_train_scaled)
        
        print("🔄 Training trend analysis model...")
        # Train trend analyzer (simplified for demo)
        trend_features = X_train[['month', 'user_income', 'user_age']].values
        self.trend_analyzer.fit(trend_features, y_train)
        
        # Evaluate models
        y_pred = self.spending_predictor.predict(X_test_scaled)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Model Training Complete!")
        print(f"📊 Model Performance:")
        print(f"   • Mean Absolute Error: ${mae:.2f}")
        print(f"   • Root Mean Square Error: ${rmse:.2f}")
        print(f"   • R² Score: {r2:.3f}")
        
        self.is_trained = True
        return {
            'mae': mae,
            'rmse': rmse,
            'r2': r2,
            'feature_importance': dict(zip(X.columns, self.spending_predictor.feature_importances_))
        }
    
    def predict_spending(self, user_data):
        """Predict future spending for a user"""
        if not self.is_trained:
            print("❌ Model not trained yet. Please call train_models() first.")
            return None
        
        # Prepare features from user data
        features = self._prepare_user_features(user_data)
        features_scaled = self.scaler.transform([features])
        
        # Predict spending
        predicted_amount = self.spending_predictor.predict(features_scaled)[0]
        confidence = self._calculate_prediction_confidence(features_scaled)
        
        return {
            'predicted_amount': max(0, predicted_amount),
            'confidence': confidence,
            'category': user_data.get('category', 'other')
        }
    
    def detect_anomalies(self, user_expenses):
        """Detect unusual spending patterns"""
        if not self.is_trained:
            return []
        
        anomalies = []
        
        for expense in user_expenses:
            features = self._prepare_user_features(expense)
            features_scaled = self.scaler.transform([features])
            
            # Detect anomaly
            anomaly_score = self.anomaly_detector.decision_function(features_scaled)[0]
            is_anomaly = self.anomaly_detector.predict(features_scaled)[0] == -1
            
            if is_anomaly:
                anomalies.append({
                    'expense': expense,
                    'anomaly_score': anomaly_score,
                    'reason': self._get_anomaly_reason(expense, anomaly_score)
                })
        
        return anomalies
    
    def generate_budget_recommendations(self, user_data, historical_expenses):
        """Generate intelligent budget recommendations"""
        if not self.is_trained:
            return {'error': 'Model not trained'}
        
        recommendations = []
        
        # Analyze each category
        for category in self.categories:
            category_expenses = [e for e in historical_expenses if e.get('category') == category]
            
            if not category_expenses:
                continue
            
            # Calculate historical average
            historical_avg = np.mean([e['amount'] for e in category_expenses])
            
            # Predict next month spending
            prediction_data = {**user_data, 'category': category}
            prediction = self.predict_spending(prediction_data)
            
            if prediction:
                predicted_amount = prediction['predicted_amount']
                confidence = prediction['confidence']
                
                # Generate recommendation
                if predicted_amount > historical_avg * 1.2:
                    rec_type = 'reduce'
                    message = f"Consider reducing {category} spending. Predicted: ${predicted_amount:.2f}, Historical: ${historical_avg:.2f}"
                elif predicted_amount < historical_avg * 0.8:
                    rec_type = 'increase'
                    message = f"You might have room to increase {category} budget. Predicted: ${predicted_amount:.2f}"
                else:
                    rec_type = 'maintain'
                    message = f"Your {category} budget looks well-balanced. Predicted: ${predicted_amount:.2f}"
                
                recommendations.append({
                    'category': category,
                    'type': rec_type,
                    'message': message,
                    'predicted_amount': predicted_amount,
                    'historical_average': historical_avg,
                    'confidence': confidence,
                    'priority': self._calculate_priority(predicted_amount, historical_avg)
                })
        
        return recommendations
    
    def analyze_spending_trends(self, user_expenses):
        """Analyze spending trends and patterns"""
        if not user_expenses:
            return {'error': 'No expense data provided'}
        
        df = pd.DataFrame(user_expenses)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        trends = {}
        
        # Overall trend
        monthly_totals = df.groupby(df['date'].dt.to_period('M'))['amount'].sum()
        if len(monthly_totals) > 1:
            trend_slope = np.polyfit(range(len(monthly_totals)), monthly_totals.values, 1)[0]
            trends['overall'] = {
                'direction': 'increasing' if trend_slope > 0 else 'decreasing',
                'slope': trend_slope,
                'monthly_change': trend_slope
            }
        
        # Category trends
        trends['by_category'] = {}
        for category in df['category'].unique():
            cat_data = df[df['category'] == category]
            cat_monthly = cat_data.groupby(cat_data['date'].dt.to_period('M'))['amount'].sum()
            
            if len(cat_monthly) > 1:
                cat_slope = np.polyfit(range(len(cat_monthly)), cat_monthly.values, 1)[0]
                trends['by_category'][category] = {
                    'direction': 'increasing' if cat_slope > 0 else 'decreasing',
                    'slope': cat_slope,
                    'average_monthly': cat_monthly.mean()
                }
        
        # Seasonal patterns
        trends['seasonal'] = {}
        for month in range(1, 13):
            month_data = df[df['date'].dt.month == month]
            if not month_data.empty:
                trends['seasonal'][month] = {
                    'average_spending': month_data['amount'].mean(),
                    'transaction_count': len(month_data)
                }
        
        return trends
    
    def get_smart_insights(self, user_data, expenses, budget_goals=None):
        """Generate comprehensive smart insights"""
        insights = {
            'predictions': {},
            'anomalies': [],
            'recommendations': [],
            'trends': {},
            'alerts': [],
            'optimization_tips': []
        }
        
        # Get predictions
        for category in self.categories:
            prediction = self.predict_spending({**user_data, 'category': category})
            if prediction:
                insights['predictions'][category] = prediction
        
        # Detect anomalies
        insights['anomalies'] = self.detect_anomalies(expenses)
        
        # Generate recommendations
        insights['recommendations'] = self.generate_budget_recommendations(user_data, expenses)
        
        # Analyze trends
        insights['trends'] = self.analyze_spending_trends(expenses)
        
        # Generate alerts
        insights['alerts'] = self._generate_alerts(expenses, budget_goals)
        
        # Optimization tips
        insights['optimization_tips'] = self._generate_optimization_tips(expenses, insights['trends'])
        
        return insights
    
    def _prepare_user_features(self, user_data):
        """Prepare features for a single user prediction"""
        if not self.feature_names:
            # Fallback if feature names not stored
            print("⚠️ Feature names not available, using default order")
            return [0] * 21  # Default to expected number of features
        
        # Create a feature vector that matches the training data structure
        features = {}
        
        # Time-based features
        features['month'] = user_data.get('month', datetime.now().month)
        features['quarter'] = user_data.get('quarter', (datetime.now().month - 1) // 3 + 1)
        features['day_of_week'] = user_data.get('day_of_week', datetime.now().weekday())
        features['is_weekend'] = 1 if datetime.now().weekday() >= 5 else 0
        
        # User features
        features['user_income'] = user_data.get('user_income', 5000)
        features['user_age'] = user_data.get('user_age', 30)
        
        # Risk tolerance features (one-hot encoded)
        risk_tolerance = user_data.get('user_risk_tolerance', 'medium')
        features['risk_high'] = 1 if risk_tolerance == 'high' else 0
        features['risk_low'] = 1 if risk_tolerance == 'low' else 0
        features['risk_medium'] = 1 if risk_tolerance == 'medium' else 0
        
        # Category features (one-hot encoded)
        category = user_data.get('category', 'other')
        for cat in self.categories:
            features[f'cat_{cat}'] = 1 if cat == category else 0
        
        # Historical features (default to 0 for new predictions)
        features['prev_month_spending'] = user_data.get('prev_month_spending', 0)
        features['avg_3month_spending'] = user_data.get('avg_3month_spending', 0)
        
        # Return features in the same order as stored feature names
        return [features.get(feat, 0) for feat in self.feature_names]
    
    def _calculate_prediction_confidence(self, features_scaled):
        """Calculate confidence score for predictions"""
        # Use ensemble variance as confidence measure
        predictions = []
        for estimator in self.spending_predictor.estimators_:
            pred = estimator.predict(features_scaled)[0]
            predictions.append(pred)
        
        variance = np.var(predictions)
        confidence = max(0, min(100, 100 - variance / 10))  # Simple confidence calculation
        return confidence
    
    def _get_anomaly_reason(self, expense, anomaly_score):
        """Determine reason for anomaly detection"""
        if anomaly_score < -0.5:
            return "Unusually high spending amount for this category"
        elif anomaly_score < -0.3:
            return "Spending pattern different from historical behavior"
        else:
            return "Minor deviation from typical spending"
    
    def _calculate_priority(self, predicted, historical):
        """Calculate priority level for recommendations"""
        ratio = predicted / historical if historical > 0 else 1
        
        if ratio > 1.5 or ratio < 0.5:
            return 'high'
        elif ratio > 1.2 or ratio < 0.8:
            return 'medium'
        else:
            return 'low'
    
    def _generate_alerts(self, expenses, budget_goals):
        """Generate spending alerts"""
        alerts = []
        
        if not expenses or not budget_goals:
            return alerts
        
        # Calculate current month spending
        current_month = datetime.now().month
        current_expenses = [e for e in expenses if datetime.fromisoformat(e['date']).month == current_month]
        
        category_spending = {}
        for expense in current_expenses:
            cat = expense['category']
            category_spending[cat] = category_spending.get(cat, 0) + expense['amount']
        
        # Check against budget goals
        for category, budget in budget_goals.items():
            spent = category_spending.get(category, 0)
            percentage = (spent / budget) * 100 if budget > 0 else 0
            
            if percentage > 90:
                alerts.append({
                    'type': 'budget_exceeded',
                    'category': category,
                    'message': f"You've spent {percentage:.1f}% of your {category} budget",
                    'severity': 'high'
                })
            elif percentage > 75:
                alerts.append({
                    'type': 'budget_warning',
                    'category': category,
                    'message': f"You've spent {percentage:.1f}% of your {category} budget",
                    'severity': 'medium'
                })
        
        return alerts
    
    def _generate_optimization_tips(self, expenses, trends):
        """Generate optimization tips based on spending analysis"""
        tips = []
        
        if not expenses or not trends.get('by_category'):
            return tips
        
        # Find highest spending categories
        category_totals = {}
        for expense in expenses:
            cat = expense['category']
            category_totals[cat] = category_totals.get(cat, 0) + expense['amount']
        
        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        
        # Generate tips for top spending categories
        for category, total in sorted_categories[:3]:
            if category in trends['by_category']:
                trend = trends['by_category'][category]
                if trend['direction'] == 'increasing':
                    tips.append({
                        'category': category,
                        'tip': f"Your {category} spending is trending upward. Consider setting a monthly limit.",
                        'potential_savings': total * 0.1  # Assume 10% savings potential
                    })
        
        return tips
    
    def save_model(self, filepath='ai_budget_model.pkl'):
        """Save trained model to disk"""
        if self.is_trained:
            model_data = {
                'spending_predictor': self.spending_predictor,
                'anomaly_detector': self.anomaly_detector,
                'trend_analyzer': self.trend_analyzer,
                'scaler': self.scaler,
                'category_encoder': self.category_encoder,
                'feature_names': self.feature_names,
                'categories': self.categories,
                'is_trained': self.is_trained
            }
            joblib.dump(model_data, filepath)
            print(f"✅ Model saved to {filepath}")
        else:
            print("❌ No trained model to save")
    
    def load_model(self, filepath='ai_budget_model.pkl'):
        """Load trained model from disk"""
        try:
            model_data = joblib.load(filepath)
            self.spending_predictor = model_data['spending_predictor']
            self.anomaly_detector = model_data['anomaly_detector']
            self.trend_analyzer = model_data['trend_analyzer']
            self.scaler = model_data['scaler']
            self.category_encoder = model_data['category_encoder']
            self.feature_names = model_data.get('feature_names', [])
            self.categories = model_data.get('categories', self.categories)
            self.is_trained = model_data['is_trained']
            print(f"✅ Model loaded from {filepath}")
        except FileNotFoundError:
            print(f"❌ Model file {filepath} not found")


def demo_ai_budget_manager():
    """Demonstrate the AI Budget Manager capabilities"""
    print("🤖 AI Budget Manager Demo")
    print("=" * 50)
    
    # Initialize and train the AI Budget Manager
    ai_budget = AIBudgetManager()
    training_results = ai_budget.train_models()
    
    print("\n📊 Training Results:")
    for key, value in training_results.items():
        if key != 'feature_importance':
            print(f"   • {key}: {value}")
    
    # Sample user data
    user_data = {
        'user_income': 6000,
        'user_age': 28,
        'user_risk_tolerance': 'medium',
        'month': datetime.now().month
    }
    
    # Sample expenses
    sample_expenses = [
        {'date': '2025-01-15', 'category': 'food', 'amount': 450},
        {'date': '2025-01-16', 'category': 'transport', 'amount': 180},
        {'date': '2025-01-17', 'category': 'shopping', 'amount': 850},  # Anomaly
        {'date': '2025-01-18', 'category': 'entertainment', 'amount': 120},
        {'date': '2025-01-19', 'category': 'utilities', 'amount': 200},
    ]
    
    # Budget goals
    budget_goals = {
        'food': 500,
        'transport': 200,
        'shopping': 300,
        'entertainment': 150,
        'utilities': 250
    }
    
    print("\n🔮 Spending Predictions:")
    for category in ['food', 'transport', 'shopping']:
        prediction = ai_budget.predict_spending({**user_data, 'category': category})
        if prediction:
            print(f"   • {category.title()}: ${prediction['predicted_amount']:.2f} (confidence: {prediction['confidence']:.1f}%)")
    
    print("\n🚨 Anomaly Detection:")
    anomalies = ai_budget.detect_anomalies(sample_expenses)
    for anomaly in anomalies:
        print(f"   • Unusual spending detected: ${anomaly['expense']['amount']} in {anomaly['expense']['category']}")
        print(f"     Reason: {anomaly['reason']}")
    
    print("\n💡 Smart Recommendations:")
    recommendations = ai_budget.generate_budget_recommendations(user_data, sample_expenses)
    for rec in recommendations[:3]:  # Show top 3
        print(f"   • {rec['category'].title()}: {rec['message']} (Priority: {rec['priority']})")
    
    print("\n📈 Comprehensive Insights:")
    insights = ai_budget.get_smart_insights(user_data, sample_expenses, budget_goals)
    
    if insights['alerts']:
        print("   Alerts:")
        for alert in insights['alerts']:
            print(f"     • {alert['message']} ({alert['severity']} priority)")
    
    if insights['optimization_tips']:
        print("   Optimization Tips:")
        for tip in insights['optimization_tips']:
            print(f"     • {tip['tip']} (Potential savings: ${tip['potential_savings']:.2f})")
    
    # Save the model
    ai_budget.save_model('ai_budget_model.pkl')
    
    print("\n✅ AI Budget Manager Demo Complete!")
    return ai_budget


if __name__ == "__main__":
    # Run the demo
    ai_manager = demo_ai_budget_manager()
