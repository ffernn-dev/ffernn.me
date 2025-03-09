---
name: bed-light
created: 2024-12-22
tags:
  - complete
  - C
  - ESP32
  - electronics
banner: "[[bed-light.png]]"
banner-y:
---
While searching for a bedside reading light, I came across a few cool LED-strip based designs built into beds. Around the same time I had bought a new bed which had a really unique frosty-clear resin strip along the top, and the winter before I remember finding out about alarm clocks that would slowly wake you up by fading a bright sun-like LED on when the real sun might not be up for a while. All three of these ideas came together and figured why not try making this light myself, as I had some small experience with microcontrollers and electronics before.
I had some clear parameters set out in front of me:
- Warm white, high CRI LED strip (more on this later)
- The ability to fade from off to full brightness at a set time every day
- Physical control for use as a reading/bedtime lamp.

Colour Rendering Index (CRI) measures the ability for an LED light to emit an entire of spectrum of light, compared to an incandescent globe or the sun. This is important because cheap white LEDs often don't reproduce the full wavelength spectrum, with peaks and troughs which lead to certain colours looking dull or over-emphasised. As this would be a primary source of light in my bedroom, it was important to me that I find an LED strip with a high CRI to seem natural and warm. I saw BTF Lighting's strips praised online, and I found an adjustable warm-white to cool-white strip with 90+ CRI on their store page, so I decided to go for that one.
To control the LED strip I decided to use an ESP32 microcontroller that I had lying around, and while researching how other people had attempted controlling adjustable temperature LEDs with the ESP I discovered the amazing WLED firmware. It was primarily made for RGB LED strips but has an analogue output option, along with a well-maintained mobile app for remote control and built-in timer functionality, making it a no-brainer for this project.
The strip runs off a 12V power supply (which I purchased from Meanwell), and draws significant current during use, meaning it can't be powered straight from the ESP32's GPIO pins. This is where I needed to make use of a device called a LED amplifier, something I had not heard of before learning about it from the WLED documentation. It uses MOSFETs to switch the power of the LEDs, controlled by input pins that are (critically) galvanically isolated from the 12V side using optocouplers. This prevents any of the higher voltage making its way back to the microcontroller and frying it. Dimming is achieved using a Pulse-Width Modulation (PWM) from the microcontroller.
Finally, I soldered and wired everything together, connected a button to toggle it on and off, and connected WLED to my wifi in order to control it and set up timers from my phone.
The light works exceptionally well and looks great in my room, and the morning fade-in helps wake me from sleep slowly before my alarm goes up so I'm not so groggy.

![[output.mp4]]

> The working light, showcasing the range of colour temperatures, brightnesses, and a WLED "heartbeat" effect for fun.