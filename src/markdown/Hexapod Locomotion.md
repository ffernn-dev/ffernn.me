---
name: hexapod-locomotion
created: 2024-09-06
tags:
  - python
  - complete
  - raspberry-pi
  - electronics
  - mechatronics
banner: "[[alfred-hero.png]]"
banner-y:
---
Hexapod robot with Inverse Kinematics-based locomotion, self-levelling, and remote control over TCP/IP.

![[hexapod.mp4]]
> The finished, working hexapod

## Project writeup
I'm taking Software Engineering in high school, and for our third Software Engineering assessment task this year we were tasked to build a **hexapod robot** from a kit which we would program to meet requirements that we set as a group. We set the following:
- Movement control and camera feed over Wi-Fi (or possibly the internet)
- Self-levelling
- Carrying objects
- Climbing sloped surfaces
- Activating an LED headlight in the dark

The kit included some demo python code which allowed for remote control of the robot over HTTP, but it had some limitations that we would have to improve upon for our project. The gait was slow, the UI only allowed for one action at a time, and the live video feed had high latency and low framerate.
After browsing through the provided code I came to the conclusion that it would be necessary use the provided Servo and IMU modules but write my own control system and **Inverse Kinematics** walking algorithm.
This turned out to be a VERY large undertaking, and I worked many a late night over the course of the 6 weeks allotted for development. My first idea was to create a model of the robot in Blender, and to use Blender's python scripting to send commands to the servos. Whilst the IK worked really well, the Blender package was too heavy to run on the Raspberry Pi that the robot was based off, sending this idea into the bin.
![[alfred-blender.mp4]]
> Hexapod model in Blender with IK

I attempted to implement **CCDIK** in python next. CCD is a popular generalised method for calculating IK, but I was finding it difficult to implement, primarily because I needed to first write the **Forward Kinematics** algorithm to build on top of. This involved choosing data structures to represent **an armature as chains of bones**, converting between **local and global coordinate and rotation systems**, and doing this for 6 legs at different positions. As you can imagine this quickly became very complicated, and combining this with the complex iteration of the CCD algorithm lead me to dead end after dead end, with no easy way to track down where the source of error was.
After a lot more research, I finally came across an article describing how to derive the simple **trigonometric equations** that define the relationship between end effector and servo angles on hexapod legs specifically, meaning I could use the exact solutions rather than the close approximation given by CCD, which would also be significantly easier to implement. I also requested a review of my armature/forward kinematics code from a friend, who was able to spot some of the last remaining bugs so that I could know any future errors came from the IK calculations. 
![[hexapodfails.mp4]]
> Progress of my IK implementation, using my Godot 3d visualisation to debug.

After these breakthroughs it was an intense sprint before the deadline with a lot still to go.
- I built **walking gaits** by moving each foot along a quadratic path with a flat bottom, staggering each leg based on one of three selectable patterns which each have tradeoffs between speed, efficiency and balance.
- The control input is given by a video game controller, as they are readily available and work well for controlling the **three movement modes**:
	- Walk with turning radius or turn on the spot
	- Strafe
	- Look around (head only)
- **Self-levelling** was achieved by tuning a **PID** control algorithm to read rotation angles given by an IMU, and rotate the **root bone** of the armature in the opposite direction. This essentially tells each leg which way is the new up, and the Inverse Kinematics algorithm does the rest of the work.
![[alfred-client-ui.png]]
> The client GUI

- The client is developed in the **Godot engine**, chosen for built-in game controller support, rapid UI development, and my familiarity. 
	- It communicates with the hexapod over **websockets** for low latency control.
	- It displays the live Inverse Kinematics state in the bottom left, which I developed very early on to utilise Godot's 3d capabilities to **visualise** the IK state for debugging. 
	- It allows for live adjustments of the robot's **stance and gait**. 
	- Finally, it displays a live feed from the camera at a **high framerate** and low latency over **webrtc**, which allows for smooth and responsive operation of the hexapod.
- Finally, one of my teammates built an LED headlamp for the robot, which I programmed to turn on and off based on a ambient light threshold using an ESP32 microcontroller strapped to the side (at the time of writing there are some firmware issues reading Light Dependent Resistors on a Raspberry Pi, so I opted for a separate MCU)