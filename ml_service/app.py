from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        students = data.get('students', [])

        if not students:
            return jsonify({'students': [], 'stats': {}})

        # Convert to DataFrame
        # Expecting students to have 'attendanceRate' and 'gpa'
        # We will preserve all student fields in the output
        df = pd.DataFrame(students)

        # Handle case with too few students for K-Means (Fallback logic)
        if len(df) < 3:
            enriched_students = []
            for student in students:
                risk_status = "Aman"
                gpa = student.get('gpa', 0)
                attendance = student.get('attendanceRate', 0)

                if gpa < 2.0 or attendance < 80:
                    risk_status = "Berisiko Tinggi"
                elif gpa < 3.0 or attendance < 90:
                    risk_status = "Berisiko Sedang"

                # Normalize GPA (0-4) and Attendance (0-100)
                norm_gpa = gpa / 4.0
                norm_att = attendance / 100.0
                risk_score = (1 - norm_gpa) + (1 - norm_att)

                student['riskStatus'] = risk_status
                student['riskScore'] = risk_score
                enriched_students.append(student)

            return jsonify({'students': enriched_students, 'stats': {}})

        # Prepare data for K-Means
        # Features: Absence Rate (100 - attendance), GPA
        df['absence'] = 100 - df['attendanceRate']

        scaler = StandardScaler()
        # [Absence, GPA]
        X = df[['absence', 'gpa']].values
        X_scaled = scaler.fit_transform(X)

        # K-Means
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(X_scaled)

        df['cluster'] = clusters

        # Interpret Clusters
        # Calculate avg GPA for each cluster to identify risk level
        # Low GPA -> High Risk
        cluster_stats = []
        for i in range(3):
            cluster_data = df[df['cluster'] == i]
            avg_gpa = cluster_data['gpa'].mean() if not cluster_data.empty else 0
            cluster_stats.append({'id': i, 'avg_gpa': avg_gpa})

        # Sort by avg_gpa ascending (Low -> High)
        cluster_stats.sort(key=lambda x: x['avg_gpa'])

        # Map: Index 0 (Lowest GPA) -> High Risk
        risk_map = {
            cluster_stats[0]['id']: "Berisiko Tinggi",
            cluster_stats[1]['id']: "Berisiko Sedang",
            cluster_stats[2]['id']: "Aman"
        }

        enriched_students = []
        for i, row in df.iterrows():
            student = students[i]
            cluster_id = row['cluster']
            student['riskStatus'] = risk_map[cluster_id]

            # Risk Score: scaled_absence - scaled_grade
            # X_scaled[i][0] is scaled absence
            # X_scaled[i][1] is scaled gpa
            # High absence (pos) - Low grade (neg) = Large Positive (High Risk)
            risk_score = X_scaled[i][0] - X_scaled[i][1]
            student['riskScore'] = risk_score
            enriched_students.append(student)

        # Calculate Stats
        stats = {}
        for cat in ["Berisiko Tinggi", "Berisiko Sedang", "Aman"]:
            cat_students = [s for s in enriched_students if s['riskStatus'] == cat]
            if cat_students:
                gpas = [s['gpa'] for s in cat_students]
                atts = [100 - s['attendanceRate'] for s in cat_students] # Stats for ABSENCE

                stats[cat] = {
                    'averageScore': {
                        'mean': float(np.mean(gpas)),
                        'min': float(np.min(gpas)),
                        'max': float(np.max(gpas)),
                        'count': len(gpas)
                    },
                    'attendance': {
                        'mean': float(np.mean(atts)),
                        'min': float(np.min(atts)),
                        'max': float(np.max(atts)),
                        'count': len(atts)
                    }
                }

        return jsonify({'students': enriched_students, 'stats': stats})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
