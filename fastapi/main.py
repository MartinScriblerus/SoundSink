import subprocess
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import aiofiles
import demucs
import librosa
import os
import shutil
import zipfile
app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/analyze_audio")
async def analyze_audio(file: UploadFile = File(...)):
    print("fuck shit hell")
    # Check if the file is a WAV file
    if not file.filename.endswith('.wav'):
        return JSONResponse({"error": "Only WAV files are supported"}, status_code=400)
    
    # Create a temporary directory if it doesn't exist
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)

    # Save the file to a temporary location
    temp_file_path = f"{temp_dir}/{file.filename}"
    async with aiofiles.open(temp_file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # try:
        try:
            subprocess.check_output(["ffmpeg", "-version"])
        except FileNotFoundError:
            return JSONResponse({"error": "FFmpeg is not installed or not in the system's PATH"}, status_code=500)

        command = f"demucs --mp3 {temp_file_path}"
        print("Running command: ", command)

        # Execute the command
        subprocess.check_output(command, shell=True)

        # Demucs will save the separated sources as files in the same directory
        # You can then load these files and perform your analysis
        # For now, just return a success message
        print(JSONResponse({"message": "File received and processed!", "filename": file.filename}))
    
        stem_path = f"{temp_file_path}/{file.filename}"
        zip_path = f"{stem_path}.zip"

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for root, _, files in os.walk(stem_path):
            for f in files:
                full_path = os.path.join(root, f)
                arcname = f  # Just file name in zip
                zipf.write(full_path, arcname)

    return FileResponse(zip_path, media_type='application/zip', filename=f"{file.filename}_stems.zip")
    # except Exception as e:
    #     return JSONResponse({"error": str(e)}, status_code=500)