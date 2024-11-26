---
title: Code test 
date: 2024-11-25
---


```js

const months = ['March', 'Jan', 'Feb', 'Dec'];
months.sort();
console.log(months);
// Expected output: Array ["Dec", "Feb", "Jan", "March"]

const array1 = [1, 30, 4, 21, 100000];
array1.sort();
console.log(array1);
// Expected output: Array [1, 100000, 21, 30, 4]
```

```bash
#!/bin/bash

# Check if required commands are installed
for cmd in ffmpeg parallel; do
    if ! command -v $cmd >/dev/null 2>&1; then
        echo "Error: $cmd is not installed. Please install $cmd."
        exit 1
    fi
done

echo "Starting FLAC to ALAC conversion..."
echo "Converting to Apple Lossless format..."

# Convert function to handle a single file
convert_file() {
    input="$1"
    output="${input%.flac}.m4a"
    
    echo "Converting: $input"
    ffmpeg -y -i "$input" -c:a alac -c:v copy -map_metadata 0 "$output" -loglevel warning
}

export -f convert_file

# Get number of CPU cores
num_cores=14

# Find all FLAC files and process them in parallel
find . -type f -name "*.flac" -print0 | \
    parallel -0 --citation -j$num_cores --bar convert_file

echo "Conversion complete!"
```
