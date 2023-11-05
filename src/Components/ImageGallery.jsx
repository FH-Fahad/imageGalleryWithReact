import { useState, useRef } from "react";
import imageData from "./imageData";
import "./ImageGallery.css";

export default function ImageGallery() {
  const [images, setImages] = useState(imageData);

  const [selectedImageCount, setSelectedImageCount] = useState(0);

  //Refs for drag-and-drop functionality
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Handle image click to select/deselect functionality.
  const handleImageClick = (imageId) => {
    // Create a copy of the images array with the selected state updated for the clicked image.
    const updatedImages = images.map((image) => {
      if (image.id === imageId) {
        return { ...image, selected: !image.selected };
      }
      return image;
    });
    // Update the state with the modiffied images array
    setImages(updatedImages);

    // Update the selected count
    setSelectedImageCount(
      updatedImages.filter((image) => image.selected).length
    );
  };

  // Handle the sorting of images for drag-and-drop functionality.
  const handleSort = () => {
    // Create a copy of the images array to avoid mutating the original array.
    const _images = [...images];

    // Extract the content of the dragged item and remove it from the array.
    const draggedItemContent = _images.splice(dragItem.current, 1)[0];

    // Insert the dragged item at the position indicated by dragOverItem.
    _images.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset the feature property for all images except the first one.
    _images.forEach((image, index) => {
      if (index === 0) {
        image.feature = true;
      } else {
        image.feature = false;
      }
    });

    // Reset drag references to null.
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the images state with the new order of images.
    setImages(_images);
  };

  // Handle deselecting all images.
  const handleDeselectAll = () => {
    // Create a copy of the images array with the 'selected' property set to false for all images.
    const updatedImages = images.map((image) => ({
      ...image,
      selected: false,
    }));
    //Update the selected images array.
    setImages(updatedImages);

    // Update the selected count to 0.
    setSelectedImageCount(0);
  };

  // Define the handleCheckboxClick functionality.
  const handleCheckboxClick = (e) => {
    //Prevent event propagation to parent clements.
    e.stopPropagation();
  };

  return (
    <div className="app">
      <div className="container">
        <h3>
          {selectedImageCount === 0 ? (
            "Gallery"
          ) : (
            <>
              <input
                type="checkbox"
                defaultChecked
                onClick={handleDeselectAll}
              />{" "}
              {selectedImageCount} File{selectedImageCount === 1 ? "" : "s"}{" "}
              Selected
            </>
          )}
        </h3>
        <button
          className={`button ${selectedImageCount > 0 ? "button" : ""}`}
          onClick={handleDeselectAll}
        >
          {selectedImageCount === 0
            ? null
            : selectedImageCount === 1
            ? "Delete File"
            : "Delete Files"}
        </button>
      </div>
      <div className="gallery">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`image-container ${image.selected ? "selected" : ""}  ${
              image.feature ? "feature" : ""
            }`}
            draggable={true}
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onClick={() => handleImageClick(image.id)}
          >
            <img
              src={image.src}
              alt={image.id}
              onClick={() => handleImageClick(image.id)}
              className={`${image.selected ? "selected" : ""}`}
            />
            {image.selected && (
              <input
                type="checkbox"
                checked
                className="checkbox"
                onClick={handleCheckboxClick}
              />
            )}
          </div>
        ))}
        <div className="image-container image-preview">
          <img src="" alt="Add Images" />
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden-input"
          />
        </div>
      </div>
    </div>
  );
}
