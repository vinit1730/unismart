import sys
import json

def main():
    try:
        raw = sys.stdin.read()
        if not raw.strip():
            return
        data = json.loads(raw)
        
        pct = float(data.get("attendancePercentage", 100.0))
        consecutive = int(data.get("missedConsecutive", 0))
        engagement = float(data.get("engagementScore", 10.0))
        
        risk_idx = ((100.0 - pct) * 0.5) + (min(consecutive, 5) * 6.0) + ((10.0 - engagement) * 2.0)
        
        if risk_idx > 45 or pct < 75.0:
            risk, rec = "High Risk", "Initiate direct formal warning notification. Require mandatory counseling review."
        elif risk_idx > 20:
            risk, rec = "Medium Risk", "Issue internal dashboard reminder alert. Recommend faculty mentor outreach."
        else:
            risk, rec = "Low Risk", "Student demonstrates continuous baseline tracking. Maintain entry cadence."

        print(json.dumps({
            "riskClassification": risk,
            "riskIndexPercentage": round(min(risk_idx, 100.0), 1),
            "aiRecommendation": rec
        }))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()