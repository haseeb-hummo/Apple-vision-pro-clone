function loco() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();

}
loco();


// Animate video play and pinning of #page1
gsap.to("#page1 video", {
  scrollTrigger: {
    trigger: "#page1>video",
    start: "2% top",
    end: "bottom top",
    scroller: "#main"
  },
  onStart: () => {
    document.querySelector("#page1>video").play();
  }
});

// Pin #page1 while scrolling
gsap.to("#page1", {
  scrollTrigger: {
    trigger: "#page1",
    start: "top top",
    end: "bottom top",
    scroller: "#main",
    pin: true
  }
});

// Animate video width change on scroll
gsap.to("#page1 video", {
  width: "60%",
  scrollTrigger: {
    trigger: "#page1 video",
    start: "bottom top",
    end: "bottom top",
    // markers: true,
    scroller: "#main",
    scrub: 5
  }
});

// Fade out .page1-bottom section
gsap.to(".page1-bottom", {
  scrollTrigger: {
    trigger: "#page1-bottom",
    start: "5% top",
    end: "bottom top",
    scroller: "#main"
  },
  opacity: 0
});

// Timeline animation for #page2 h1
const t1 = gsap.timeline({
  scrollTrigger: {
    trigger: "#page2",
    scroller: "#main",
    start: "top top",
    // markers: true,
    pin: true,
    scrub: 1,
  },
});

t1.to("#page2 h1", {
  top: "-50%",
});

// Timeline animation for #page3 h1
const t2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#page3",
    scroller: "#main",
    start: "top top",
    // markers : true,
    pin: true,
    scrub: 1,
  }
});

t2.to("#page3 h1", {
  top: "-50%"
});



function setupCanvas() {
  // Get canvas and context
  const canvas = document.querySelector("#page8 canvas");
  const context = canvas.getContext("2d");

  // Set initial canvas dimensions
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  // Image information
  const canvasInfo = {
    totalFrames: 200,
    images: [],
    currentFrame: 0,
    currentImage: (index) =>
      `https://www.apple.com/105/media/us/apple-vision-pro/2023/7e268c13-eb22-493d-a860-f0637bacb569/anim/360/large/0${index
        .toString()
        .padStart(3, 0)}.jpg`,
  };

  // Load first image
  const img = new Image();
  img.src = canvasInfo.currentImage(0);
  img.onload = () => {
    canvas.height = img.height;
    canvas.width = img.width;
    render();
  };

  // Load all images
  for (let i = 0; i < canvasInfo.totalFrames; i++) {
    const img = new Image();
    img.src = canvasInfo.currentImage(i);
    canvasInfo.images.push(img);
  }

  // GSAP animation
  gsap.to(canvasInfo, {
    currentFrame: canvasInfo.totalFrames - 1,
    snap: "currentFrame",
    ease: "none",
    scrollTrigger: {
      trigger: canvas,
      start: "5% top",
      scroller: "#main",
      scrub: 0.5,
      pin: true,
      // markers: true,
      onEnter: () => {
        TweenMax.to(canvas, 2, { width: "70%", height: "70%", ease: "power2.out" });
      },
      onLeaveBack: () => {
        TweenMax.to(canvas, 2, { width: "100%", height: "100%", ease: "power2.out" });
      },
    },
    onUpdate: render,
  });

  // Draw initial image on canvas
  canvasInfo.images[0].onload = () => {
    context.drawImage(canvasInfo.images[0], 0, 0);
  };

  // Render function
  function render() {
    scaleImage(canvasInfo.images[canvasInfo.currentFrame], context);
  }

  // Scale and draw image
  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }
}

// Initialize the canvas setup
setupCanvas();

