+++
title = "Why you can't use cheap Arduinos as camera controllers"
date = 2025-05-29T16:33:01+02:00
draft = false
summary = "I tried building a webcam with scraps in a cave"
+++

I woke up one day, thinking i could build a USB camera with a scrap Arduino i
had in a box, because i saw that the camera modules themselves are actually
quite simple to use via I2C. The goal was a camera that can produce at least
stable 480p at 25fps.

The Arduino on my table was a Nano v3 - ultra low power, 20 MIPS at 8-Bit (oof)
and 2kb SRAM. Any normal person would probably stop here.

The UART to USB chip thingy was a CH340, which supports all the speed i need?
maybe? WHO knows, as i haven't read the USB spec at the time of writing this
paragraph. Depending on how the communication actually works this might be
enough. At least according to some random spec sheet online i can get up to
2Mbps (**baudrate**) over this chip. Because of UART, i might be able to use
1.6 Mbps - 200KB/s doesn't sound like a lot to me now. 

With some napkin math i calculated, that this would barely do the job, as 8Bit
color uncompressed 480x640 at 30 FPS would need 2MBps (notice the big B - thats
equivalent to 16Mbps), so an about 8 times higher bandwidth. Can the Arduino
compress video quick enough? Short answer: no. The camera module would already
need to compress the video data, so that the Arduino would just have to push it
through the USB interface. If that is the whole job of the controller, it might
be enough. However, i would need a camera module that can communicate via I2C
and also already compress the video feed to either MJPEG or H264 (so that i can
implement the simpler USB specs).

These things do not exist. Sad!

Some other things i noticed later: One can hardly communicate via UART chips
without additional software on the PC side, as the CH340 already needs drivers
to allow the "base" communication itself. I did not really think that through,
but it was an idea that made me learn about the USB spec for cameras. Still
failed the course that made me think i could pull this off tho.
