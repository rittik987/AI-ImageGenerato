

# AI Image Generator

AI Image Generator is a Next.js web application that leverages Hugging Face’s Inference API (e.g., Stable Diffusion 3.5) to generate beautiful AI art from text prompts. Customize generation parameters such as image dimensions, number of inference steps, guidance scale, and seed to fine-tune the output. Generated images are converted to Base64 and stored in local storage, with a scrollable history grid and a modal for full-screen preview, download, and deletion.

## Features

- **Dynamic Settings:**  
  Adjust dimensions, steps, guidance scale, seed, and style to control the generation process.

- **Real-Time Generation:**  
  Uses Hugging Face’s API to generate images from your text prompts.

- **Image Persistence:**  
  Images are stored as Base64 strings in local storage, ensuring they remain available even after a browser reload.

- **User-Friendly UI:**  
  A responsive interface built with Next.js and Tailwind CSS featuring a settings sidebar, tabbed view (Prompt/History), and a full-screen modal for image preview.

- **Image Management:**  
  Easily preview, download, and delete images from your history.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rittik987/ai-image-generator.git
   cd ai-image-generator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the project root and add your Hugging Face API key:

   ```env
   NEXT_PUBLIC_HF_API_KEY=your_api_key_here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## How to Use

1. **Adjust Settings:**  
   Use the left sidebar to set your desired dimensions, steps, guidance scale, seed, and style for image generation.

2. **Enter a Prompt:**  
   In the Prompt tab, type a creative text prompt (e.g., "A couple in a gentle embrace under a pastel sunset by the ocean").

3. **Generate Image:**  
   Click the "Generate" button. The app will call the Hugging Face API to create your image.

4. **View History:**  
   Once generated, the image is added to your history. Switch to the History tab to view all generated images in a scrollable grid.

5. **Image Preview & Management:**  
   Click on any image in the history to open a modal for full-screen preview. From the modal, you can download or delete the image.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

