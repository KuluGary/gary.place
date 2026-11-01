
#!/usr/bin/env bash

set -euo pipefail

# Usage: ./resize-images.sh <directory> [width]
# Default width: 360px

INPUT_DIR="${1:?Usage: $0 <directory> [width]}"
WIDTH="${2:-360}"

if ! command -v ffmpeg &>/dev/null; then
    echo "Error: ffmpeg is not installed."
    exit 1
fi

if [[ ! -d "$INPUT_DIR" ]]; then
    echo "Error: Directory '$INPUT_DIR' does not exist."
    exit 1
fi

if ! [[ "$WIDTH" =~ ^[0-9]+$ ]] || (( WIDTH <= 0 )); then
    echo "Error: Width must be a positive integer."
    exit 1
fi

find "$INPUT_DIR" -maxdepth 1 -type f \
    \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \
       -o -iname "*.webp" -o -iname "*.bmp" -o -iname "*.tiff" \) \
    -print0 |
while IFS= read -r -d '' FILE; do
    echo "Resizing: $FILE"

    EXT="${FILE##*.}"
    TEMP_FILE="${FILE%.*}.tmp.${EXT}"

    ffmpeg -hide_banner -loglevel error -y \
        -i "$FILE" \
        -vf "scale=${WIDTH}:-1" \
        "$TEMP_FILE"

    mv "$TEMP_FILE" "$FILE"
done

echo "Done!"
