const CACHE_NAME = "kiosk-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/noimage.png",
  "/icon-192.png",
  "/icon-512.png"
];

// 설치 단계 - 캐시 파일 저장
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시 저장 완료");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 활성화 단계 - 이전 캐시 정리
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("이전 캐시 삭제:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// fetch 이벤트 - 캐시 우선 응답
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
