import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os
from utils import calculate_features

# 1. Generate Synthetic Data
# We need data that looks like the real data to train the Scaler and KMeans
np.random.seed(42)
n_samples = 1000

data = {
    'nis': np.arange(1000, 1000 + n_samples),
    'nama_siswa': [f'Siswa {i}' for i in range(n_samples)],
    'sakit': np.random.poisson(2, n_samples),
    'izin': np.random.poisson(2, n_samples),
    'alpa': np.random.poisson(1, n_samples),
}

# Generate random grades (list of 12 grades for 2 semesters maybe, simulating monthly/exam scores)
# Create some patterns: high performing, low performing, declining, improving
grades = []
for _ in range(n_samples):
    pattern = np.random.choice(['high', 'low', 'decline', 'improve'], p=[0.3, 0.3, 0.2, 0.2])
    base = 0
    if pattern == 'high':
        base = np.random.normal(85, 5)
        trend = 0
    elif pattern == 'low':
        base = np.random.normal(50, 10)
        trend = 0
    elif pattern == 'decline':
        base = np.random.normal(80, 5)
        trend = -2 # drops 2 points per entry
    elif pattern == 'improve':
        base = np.random.normal(50, 5)
        trend = 2
    
    student_grades = []
    current = base
    for _ in range(12): # 12 grades
        val = np.clip(current + np.random.normal(0, 3), 0, 100)
        student_grades.append(val)
        current += trend
    grades.append(student_grades)

data['nilai'] = grades

df = pd.DataFrame(data)

# 2. Feature Engineering
print("Calculating features...")
df = calculate_features(df)

# 3. Prepare for Clustering
# Features used in notebook: 'total_absensi', 'rata_rata_nilai', 'perubahan_nilai', 'volatilitas_nilai', 'rasio_kehadiran'
clustering_features = [
    'total_absensi',
    'rata_rata_nilai',
    'perubahan_nilai',
    'volatilitas_nilai',
    'rasio_kehadiran'
]

# Drop NaNs just in case
df_clean = df.dropna(subset=clustering_features)
X = df_clean[clustering_features]

# 4. Train Scaler & Model
print("Training model...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
kmeans.fit(X_scaled)

# 5. Save Artifacts
print("Saving artifacts...")
joblib.dump(kmeans, 'model.joblib')
joblib.dump(scaler, 'scaler.joblib')

print("✅ Model and Scaler saved successfully!")
print("Cluster Centers:")
print(kmeans.cluster_centers_)
