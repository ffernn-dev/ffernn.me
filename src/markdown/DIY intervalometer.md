---
name: intervalometer
created: 2025-03-09
tags:
  - C
  - ESP32
  - in-progress
banner: "[[intervalometer-hero.png]]"
banner-y:
---
I am in the process of building an intervalometer to take a long-exposure Milky Way timelapse. The purpose of an intervalometer is to regularly release the shutter on a camera so you can take long timelapses without needing to manually take each photo. In my case, my camera has a 3.5mm jack on the side that just needs two contacts to be shorted in order to release the shutter. I built a small device using parts I had lying around: a Seeed Studio Xiao nrf52840 microcontroller because of its small size and battery charging capability, an 18650 battery holder, and a small 0.91 inch OLED display. The device uses a transistor to short the pins of the connected 3.5mm cable, releasing the shutter at defined intervals. The display is mostly for fun and because I wanted to practice writing GUI code, but it does serve to show the current settings and status (as well as a cute cat that reflects the state of the device hehe!). 
To configure and control the device, I've almost finished developing an iOS app that interfaces with the microcontroller via Bluetooth Low Energy, as seen in the image above. At the moment you can view the battery level, set the exposure time and how many photos you wish to take, but I still need to add a UI element to start/pause/stop the shooting and one to set the brightness of the screen.