import { useState, useRef } from "react";
import "./ImageGallery.css";
import imageData from "./imageData";

export default function ImageGallery() {
  const [images, setImages] = useState(imageData);

  const [selectedCount, setSelectedCount] = useState(0);

  //Refs for drag-and-drop functionality
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Handle image click to select/deselect
  const handleImageClick = (imageId) => {
    const updatedImages = images.map((image) => {
      if (image.id === imageId) {
        return { ...image, selected: !image.selected };
      }
      return image;
    });
    setImages(updatedImages);

    // Update the selected count
    setSelectedCount(updatedImages.filter((image) => image.selected).length);
  };

  // Handle image sorting for drag-and-drop
  const handleSort = () => {
    const _images = [...images];

    const draggedItemContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset drag references
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the images state with the new order
    setImages(_images);
  };

  // Handle deselecting all images
  const handleDeselectAll = () => {
    const updatedImages = images.map((image) => ({
      ...image,
      selected: false,
    }));
    setImages(updatedImages);

    // Update the selected count
    setSelectedCount(0);
  };

  return (
    <div className="app">
      <div className="button-container">
        <h3>
          {selectedCount === 0 ? (
            "Gallery"
          ) : (
            <>
              <input
                type="checkbox"
                defaultChecked
                onClick={handleDeselectAll}
              />{" "}
              {selectedCount} File{selectedCount === 1 ? "" : "s"} Selected
            </>
          )}
        </h3>
        <button
          className={`button ${selectedCount > 0 ? "button" : ""}`}
          onClick={handleDeselectAll}
        >
          {selectedCount === 0
            ? null
            : selectedCount === 1
            ? "Delete File"
            : "Delete Files"}
        </button>
      </div>
      <div className="gallery">
        {images.map((image, index) => (
          <div
            key={index}
            className={`image-container ${image.feature ? "feature" : ""}  ${
              image.selected ? "selected" : ""
            }`}
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.src}
              alt=""
              onClick={() => handleImageClick(index)}
              className={`${image.selected ? "selected" : ""}`}
            />
          </div>
        ))}
        <div className="image-container image-preview">
          <img alt="Add Images" />
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
