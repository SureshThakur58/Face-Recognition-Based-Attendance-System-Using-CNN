from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import subprocess
import os
from dataCollect import collect_face_data  # Import the function from dataCollect.py
import requests

app = FastAPI()

class Data(BaseModel):
    name: str
    roll_number: str

@app.post("/collect-data")
async def collect_data(data: Data):
    # Use the function from dataCollect.py to handle the data
    collected_data = collect_face_data(data.name, data.roll_number)

    # Prepare the response with the desired format
    fastapi_response = {
        "message": "Data collected",
        "data": collected_data
    }

    return {
        "message": "Data saved and forwarded successfully",
        "fastapiResponse": fastapi_response
    }


# Endpoint to train the model (modelTraining.py)
# Data model to validate incoming requests
@app.post("/train-model")
async def train_model():
    try:
        # Start the model training script
        process = subprocess.Popen(
            ['python', 'train_model.py'], 
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Error during training: {stderr.decode()}")

        return {"message": "Model trained successfully", "output": stdout.decode()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# recognition 
class RecognitionResponse(BaseModel):
    name: str

@app.post("/recognize-face", response_model=RecognitionResponse)
def recognize_face():
    try:
        result = subprocess.run(["python", "RealTimeFaceRecognition.py"], capture_output=True, text=True)

        if result.returncode == 0:
            output = result.stdout.strip()
            if output:  # Ensure output is not empty
                return {"name": output}
            else:
                return {"name": "Unknown"}
        else:
            error_msg = result.stderr.strip() or "Face recognition script failed"
            raise HTTPException(status_code=500, detail=error_msg)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Function to run scripts as background tasks
def run_script(collected_data: str):
    try:
        subprocess.run(collected_data, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")

# Run the FastAPI app
# uvicorn app:app --reload
