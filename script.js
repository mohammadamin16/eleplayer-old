const videoJson = {
  description: "The first Blender Open Movie from 2006",
  sources: [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  ],
  subtitle: "By Blender Foundation",
  thumb: "images/ElephantsDream.jpg",
  title: "Elephant Dream",
};

const LocalFile =
  "file:///Users/amin/Downloads/Family.Guy.S07E03.1080p.WEB-DL.x265.SoftSub.DonyayeSerial.mkv";

const videoPlayer = document.getElementById("videoPlayer");
const progessBar = document.getElementById("progress");
const draggerEl = document.getElementById("dragger");
const thumbEl = document.getElementById("thumb");
const thumbImg = document.getElementById("thumb-img");
const appContainer = document.getElementById("container");
const timeline = document.getElementById("timeline");

const thumbCache = {};

timeline.addEventListener("click", function (e) {
  const pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
  videoPlayer.currentTime = pos * videoPlayer.duration;
});
const videoSource = document.createElement("source");
videoSource.setAttribute("src", LocalFile);
videoSource.setAttribute("type", "video/mp4");
videoPlayer.appendChild(videoSource);

timeline.addEventListener("mousemove", function (e) {
  thumbEl.style.display = "block";
  const left = e.pageX + "px";
  thumbEl.style.left = left;
  const second = round1(
    (e.pageX / timeline.offsetWidth) * videoPlayer.duration
  );
  setThumbByTime(second);
});
timeline.addEventListener("mouseleave", function (e) {
  thumbEl.style.display = "none";
});

function init() {
  const videoRatio = videoPlayer.videoWidth / videoPlayer.videoHeight;
  const thumbWidth = 160;
  thumbEl.style.width = thumbWidth + "px";
  thumbEl.style.height = thumbWidth / videoRatio + "px";
}
init();
videoPlayer.addEventListener("timeupdate", function (e) {
  const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progessBar.style.width = percent + "%";
  const left = progessBar.getBoundingClientRect().width;
  draggerEl.style.left = left + "px";
});
async function setThumbByTime(time) {
  if (thumbCache[time]) {
    thumbImg.setAttribute("src", thumbCache[time]);
    return;
  }
  const dataURI = await getThumbByTime(time);
  thumbImg.setAttribute("src", dataURI);

  thumbCache[time] = dataURI;
}

const fakeVideoPlayer = document.createElement("video");
fakeVideoPlayer.setAttribute("src", videoSource.getAttribute("src"));
fakeVideoPlayer.setAttribute("type", "video/mp4");
document.appendChild(fakeVideoPlayer);
async function getThumbByTime(time) {
  fakeVideoPlayer.currentTime = time;
  fakeVideoPlayer.pause();
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;

  await setVideoTime(fakeVideoPlayer, time);
  const context = canvas.getContext("2d");
  context.drawImage(fakeVideoPlayer, 0, 0, canvas.width, canvas.height);
  const dataURI = canvas.toDataURL("image/jpeg");
  return dataURI;
}

function setVideoTime(videoElement, targetTimeInSeconds) {
  return new Promise((resolve, reject) => {
    videoElement.currentTime = targetTimeInSeconds;

    videoElement.addEventListener("seeked", function onSeeked() {
      videoElement.removeEventListener("seeked", onSeeked);
      resolve();
    });
    videoElement.addEventListener("loadeddata", function onLoadedData() {
      videoElement.removeEventListener("loadeddata", onLoadedData);
      resolve();
    });

    videoElement.addEventListener("error", function onError(event) {
      videoElement.removeEventListener("loadeddata", onLoadedData);
      reject(event);
    });
  });
}

function round5(x) {
  return Math.ceil(x / 5) * 5;
}
function round1(x) {
  return Math.ceil(x);
}
