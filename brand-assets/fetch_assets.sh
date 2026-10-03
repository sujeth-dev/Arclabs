#!/bin/sh
# Downloads the original brand files into each folder, unchanged.
set -e
cd "$(dirname "$0")"
curl -fsSL -o 'velmont/logo.png' 'https://www.velmontdesign.com/assets/logos/velmont-main.png'
curl -fsSL -o 'velmont/logo-light.png' 'https://www.velmontdesign.com/assets/logos/velmont-white.png'
curl -fsSL -o 'velmont/favicon.png' 'https://www.velmontdesign.com/favicon-192.png'
curl -fsSL -o 'the-possah/logo.png' 'https://thepossah.com/images/logo.png'
curl -fsSL -o 'the-possah/logo-wordmark.png' 'https://thepossah.com/images/name.png'
curl -fsSL -o 'the-possah/favicon.png' 'https://thepossah.com/icon.png'
curl -fsSL -o 'zingara/logo.webp' 'https://www.zingararestaurant.co.in/images/logo.webp'
curl -fsSL -o 'zingara/logo-wordmark.webp' 'https://www.zingararestaurant.co.in/images/Zingara.webp'
curl -fsSL -o 'zingara/favicon.png' 'https://www.zingararestaurant.co.in/apple-touch-icon.png'
curl -fsSL -o 'fitness-garage/logo.png' 'https://www.fitness-garage.in/images/logo1.png'
curl -fsSL -o 'fitness-garage/favicon.png' 'https://www.fitness-garage.in/images/logo1.png'
curl -fsSL -o 'assetly/logo.png' 'https://assetly.lease/brand/assetly-mark.png'
curl -fsSL -o 'assetly/favicon.png' 'https://assetly.lease/icon.png'
curl -fsSL -o 'aivora-india/logo.png' 'https://www.aivoraindia.com/AI_Vero.PNG'
curl -fsSL -o 'aivora-india/favicon.png' 'https://www.aivoraindia.com/AI_Vero.PNG'
echo "Done."
