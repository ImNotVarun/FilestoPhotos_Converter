
# Files to Image Converter

This project is a web application that allows users to convert multiple files into a single image and extract files from such an image. It's built with Flask and uses image processing techniques to encode and decode files.

## Features

- Convert multiple files into a single PNG image
- Extract files from a specially encoded PNG image
- Real-time progress tracking for file uploads
- Responsive design with a dark, aesthetic theme

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.7+
- pip (Python package manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/files-to-image-converter.git
   cd files-to-image-converter
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask application:
   ```
   python app.py
   ```

2. Open a web browser and navigate to `http://localhost:8080`

3. To convert files to an image:
   - Click "Choose Files" under "Convert Files to Image"
   - Select one or more files
   - Click "Convert to Image"
   - The browser will download a PNG image containing your files

4. To extract files from an image:
   - Click "Choose Image" under "Extract Files from Image"
   - Select a PNG image created by this application
   - Click "Extract Files"
   - The browser will download a ZIP file containing the extracted files

## How It Works

- Files are encoded into base64 strings and combined into a single string
- The combined string is converted into a 2D numpy array
- The array is saved as a PNG image
- To extract, the process is reversed
