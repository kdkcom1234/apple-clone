(function () {
  let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된 씬

  const sceneInfo = [
    {
      //0
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    {
      //1
      type: 'normal',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      //2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      },
    },
    {
      //3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    // 기본적으로 컨테츠 높이만큼만 스크롤이 생기기 때문에
    // 스크롤 영역을 만드려면 높이를 별도로 만들어야함
    for (let scene of sceneInfo) {
      scene.scrollHeight = scene.heightNum * window.innerHeight;
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    }

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= scrollY) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  // 스타일 수치 계산
  // 미개변수: 계산할 값 범위, 현재씬에서 얼마나 스크롤했는지
  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬에서 스크롤된 범위
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (scrollY >= partScrollStart && currentYOffset <= partScrollEnd) {
        // 전체스크롤 - 부분시작지점 /  부분스크롤크기
        rv = ((scrollY - partScrollStart) / scrollHeight) * (values[1] - values[0]) + values[0];
      } else if (scrollY < partScrollStart) {
        rv = values[0];
      } else if (scrollY > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = scrollY - prevScrollHeight; // 현재 씬에서 스크롤한 범위
    // console.log(currentScene);

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
        const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        console.log(messageA_opacity_in);
        break;
      case 1:
        // console.log('1 play');
        break;
      case 2:
        // console.log('2 play');
        break;
      case 3:
        // console.log('3 play');
        break;
    }
  }

  // 특정 스크롤 포지션이 되면 해당 섹션의 내용을 보여줌
  // 바디의 id를 변경하여 해당 섹션의 스티키 문구를 block으로 보여줌
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (scrollY > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // currentScene !== 0 -> 모바일에서 상단 바운싱일 떄 -스크롤값 방지
    if (currentScene !== 0 && scrollY < prevScrollHeight) {
      enterNewScene = true;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
  }

  window.addEventListener('scroll', () => {
    scrollLoop();
  });
  window.addEventListener('resize', setLayout);
  window.addEventListener('load', setLayout);
})();
