const baseURL = "//13.114.181.168:8080";

window.addEventListener("load", () => {
  const bgTag = document.getElementById("bg");
  const seTag = document.getElementById("se");

  const bgVolume = getCookie("backgroundMusicVolume");
  const seVolume = getCookie("soundEffectsVolume");

  if (bgTag && bgVolume) bgTag.volume = bgVolume;
  if (seTag && seVolume) seTag.volume = seVolume;

  const id = sessionStorage.getItem("gameId");
  if (id === null) {
  } else if (location.pathname !== "/jurumarble-FE/play/") {
    $.ajax({
      url: `${baseURL}/api/v1/status/${id}`,
      type: "GET",
      contentType: "application/json",
      success: (res) => {
        if (res === "") sessionStorage.removeItem("gameId");
        else location.href = "/jurumarble-FE/play";
      },
    });
  }
});

const getCookie = (cookieName) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
};
