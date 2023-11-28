document.addEventListener('DOMContentLoaded', function() {
    const bg = document.getElementById('bg');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const se = document.getElementById('se');
    const soundEffects = document.getElementById('soundEffects');
    const buttons = document.querySelectorAll('button');

    // 배경 음악 볼륨 조절
    backgroundMusic.addEventListener('input', function() {
        bg.volume = backgroundMusic.value;
        setVolumeCookie(); // 볼륨 변경 시 쿠키 업데이트
    });

    // 효과음 볼륨 조절
    soundEffects.addEventListener('input', function() {
        se.volume = soundEffects.value;
        setVolumeCookie(); // 볼륨 변경 시 쿠키 업데이트
    });

    // 버튼 클릭 시 효과음 재생
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            playSoundEffect();
        });
    });

    // 쿠키에서 저장된 볼륨 값 가져오기
    const backgroundMusicVolume = getCookie('backgroundMusicVolume');
    const soundEffectsVolume = getCookie('soundEffectsVolume');

    // 쿠키가 존재하는 경우, 볼륨 설정
    if (backgroundMusicVolume) {
        backgroundMusic.value = backgroundMusicVolume;
        bg.volume = backgroundMusicVolume;
    }
    if (soundEffectsVolume) {
        soundEffects.value = soundEffectsVolume;
        se.volume = soundEffectsVolume;
    }

});

function playSoundEffect() {
    const sound = document.getElementById('se');
    sound.play();
}

function setVolumeCookie() {
    const backgroundMusicVolume = backgroundMusic.value;
    const soundEffectsVolume = soundEffects.value;

    // 쿠키 이름과 값 설정, ${backgroundMusicVolume}는 변수 backgroundMusicVolume의 값
    document.cookie = `backgroundMusicVolume=${backgroundMusicVolume}; path=/;`
    document.cookie = `soundEffectsVolume=${soundEffectsVolume}; path=/;`
}

function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}
