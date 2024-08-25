from flask import Flask, render_template, request, send_file, redirect, url_for
import base64
from PIL import Image
import numpy as np
import io
import zipfile
import os  # Add this import statement

app = Flask(__name__)

# Convert multiple files to an image


def files_to_image(files):
    encoded_files = []

    for file in files:
        file_data = file.read()
        encoded_data = base64.b64encode(file_data).decode('utf-8')
        file_name = file.filename
        encoded_files.append(
            f"{file_name}||{len(encoded_data)}||{encoded_data}")

    combined_encoded_data = '<<>>'.join(encoded_files)
    data_len = len(combined_encoded_data)
    image_size = int(np.ceil(np.sqrt(data_len / 3)))
    image_array = np.zeros((image_size, image_size, 3), dtype=np.uint8)

    encoded_bytes = combined_encoded_data.encode('utf-8')
    flat_image_array = image_array.flatten()

    for i in range(min(len(flat_image_array), len(encoded_bytes))):
        flat_image_array[i] = encoded_bytes[i]

    image_array = flat_image_array.reshape((image_size, image_size, 3))
    image = Image.fromarray(image_array)
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    return img_byte_arr

# Extract files from an image


def image_to_files(image_data):
    image = Image.open(io.BytesIO(image_data))
    image_array = np.array(image)

    flat_image_array = image_array.flatten()
    encoded_bytes = bytes([byte for byte in flat_image_array if byte != 0])

    combined_encoded_data = encoded_bytes.decode('utf-8')
    encoded_files = combined_encoded_data.split('<<>>')

    extracted_files = []
    for encoded_file in encoded_files:
        if '||' in encoded_file:
            file_name, file_size, encoded_data = encoded_file.split('||')
            decoded_data = base64.b64decode(encoded_data)
            extracted_files.append((file_name, decoded_data))

    return extracted_files


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload_files', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return redirect(url_for('index'))

    files = request.files.getlist('files')
    img_data = files_to_image(files)
    return send_file(io.BytesIO(img_data), mimetype='image/png', as_attachment=True, download_name='files_image.png')


@app.route('/extract_files', methods=['POST'])
def extract_files():
    if 'image' not in request.files:
        return redirect(url_for('index'))

    image = request.files['image'].read()
    extracted_files = image_to_files(image)

    # Create a zip file in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'a', zipfile.ZIP_DEFLATED) as zip_file:
        for file_name, data in extracted_files:
            zip_file.writestr(file_name, data)

    zip_buffer.seek(0)
    return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='extracted_files.zip')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
