class Object_menu {
    constructor() {
        this.countItem = 1;
        this.FourierObjects = [];
        this.FuncObjects = [];
        this.PolygonObjects = [];

        this.onlyOption = false;
        this.addObject();
    }

    addObject() {
        if (!this.onlyOption) {
            showAddObjectMenu();
            closeAddObjectMenu();
            optionObject(this);
        } else {
            $(".add").click(() => {
                this.FourierObjects.push(new Fourier(this.countItem));
            })
        }

        function showAddObjectMenu() {
            $(".add").click((e) => {
                let x = e.pageX;
                let y = e.pageY;
                $(".addMenu").fadeIn(200).css({
                    'left': x + 'px',
                    'top': y + 'px'
                }).click(() => $(".addMenu").fadeOut(100));
            });
        }

        function closeAddObjectMenu() {
            $(".canvas-container").click(() => {
                $(".addMenu").fadeOut(100)
            });
        }

        function optionObject(obj) {
            let addMenuItems = $(".addMenu .addMenuItem");
            for (let i = 0; i < addMenuItems.length; i++) {
                $(addMenuItems[i]).click(() => {
                    let type = i;
                    switch (type) {
                        case 0:
                            obj.FuncObjects.push(new Func(obj.countItem));
                            break;
                        case 1:
                            obj.FourierObjects.push(new Fourier(obj.countItem));
                            break;
                        case 2:
                            obj.PolygonObjects.push(new PolygonInCircle(obj.countItem));
                            break;
                        default:
                            console.error("no find the type");
                    }
                });
            }
        }
    }
}

class Window {
    constructor() {
        this.resize();
    }

    resize() {
        $(window).resize(() => {
            width = $(".canvas-container").width()
            height = $(".canvas-container").height()
            renderer.setSize(width, height);
        });
    }
}

class setting {
    constructor() {
        this.ListenTheme();
        this.event();
    }

    ListenTheme() {
        const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)"); // 是深色
        if (isDarkTheme.matches) { // 是深色
            console.log("深色")
            this.night_or_day(true);
        } else { // 不是深色
            console.log("不是深色");
            this.night_or_day(false);
        }
    }

    night_or_day(toggle) {
        if (toggle == true) { // night
            scene.background = new THREE.Color(0xe000000);

            $(".toNight").text("日间模式");
        } else { // day
            scene.background = new THREE.Color(0xeff4fa);

            $(".toNight").text("夜间模式");
        }
    }

    event() {
        $(".circular-motion").click(() => {
            circularMotion = circularMotion ? false : true;
        });
    }
}


// ！！！！！！高耦合警告！！！！！！！！
let ObjectMenu = new Object_menu();

// 启动窗口事件
let start_window_event = new Window();

// 启动昼夜主题自动切换
let startSetting = new setting();