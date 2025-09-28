import './index.css';
import liff from '@line/liff'

document.addEventListener("DOMContentLoaded", function () {
    liff
        .init({ liffId: process.env.LIFF_ID })
        .then(() => {
            console.log("Success! you can do something with LIFF API here.")

            document.getElementById('login').addEventListener("click", liff_login);
            document.getElementById('logout').addEventListener("click", liff_logout);
            document.getElementById('stp').addEventListener("click", liff_shareTargetPicler);
            document.getElementById('scan').addEventListener("click", liff_scan);

            document.getElementById('service_message').addEventListener("click", mini_serviceMessage);
            document.getElementById('custom_action').addEventListener("click", mini_customAction);

            if (liff.isLoggedIn()) {
                const idToken = liff.getDecodedIDToken();
                document.getElementById('profile_img').src = idToken.picture
                document.getElementById('profile_string').innerHTML = "こんにちは！" + idToken.name + "さん！"
            } else {
                document.getElementById('profile_string').innerHTML = "ログインされていません。"
            }

            // --- Calendar Logic ---
            const monthYearElement = document.getElementById('month-year');
            const calendarGrid = document.getElementById('calendar-grid');
            const prevMonthBtn = document.getElementById('prev-month-btn');
            const nextMonthBtn = document.getElementById('next-month-btn');

            let currentDate = new Date();

            function renderCalendar() {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                monthYearElement.textContent = `${year}年 ${month + 1}月`;

                // Clear previous calendar days
                const dayElements = calendarGrid.querySelectorAll('.calendar-day');
                dayElements.forEach(day => day.remove());

                const firstDayOfMonth = new Date(year, month, 1);
                const lastDayOfMonth = new Date(year, month + 1, 0);
                const startingDay = firstDayOfMonth.getDay();

                // Add empty cells for days before the 1st
                for (let i = 0; i < startingDay; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.classList.add('calendar-day', 'empty');
                    calendarGrid.appendChild(emptyCell);
                }

                // Add cells for each day of the month
                for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
                    const dayCell = document.createElement('div');
                    dayCell.classList.add('calendar-day');
                    dayCell.textContent = i;
                    dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

                    // Add click event listener for reservation
                    dayCell.addEventListener('click', () => {
                        const selectedDate = dayCell.dataset.date;
                        if (!liff.isLoggedIn()) {
                            alert("予約するにはLINEログインが必要です。");
                            liff.login();
                            return;
                        }

                        const idToken = liff.getDecodedIDToken();
                        const userId = idToken.sub; // Use 'sub' from ID token for user ID
                        const userName = idToken.name; // Get user's display name

                        // Call the backend to send a notification
                        fetch('http://localhost:3000/api/notify-reservation', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                                userId: userId,
                                userName: userName,
                                date: selectedDate 
                            }),
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert(`予約通知を送信しました：${selectedDate}`);
                            } else {
                                alert('通知の送信に失敗しました。');
                                console.error('Backend error:', data.error);
                            }
                        })
                        .catch(error => {
                            alert('サーバーとの通信に失敗しました。');
                            console.error('Fetch error:', error);
                        });
                    });

                    calendarGrid.appendChild(dayCell);
                }
            }

            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });

            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });

            renderCalendar(); // Initial render
        })
        .catch((error) => {
            console.log(error)
        })
});


function liff_login() {
    liff.login()
}

function liff_logout() {
    liff.logout()
    location.reload()
}

function liff_shareTargetPicler() {
    if (liff.isLoggedIn()) {
        liff
            .shareTargetPicker(
                [
                    {
                        type: "text",
                        text: "Hello, World!",
                    },
                ]
            )
    } else {
        alert("shareTargetPickerの利用にはログインが必要です。")
    }
}

function liff_scan() {
    if (liff.isLoggedIn()) {
        liff
            .scanCodeV2()
            .then((result) => {
                alert(result.value)
            })
            .catch((error) => {
                console.log("error", error);
            });
    } else {
        alert("scanCodeV2の利用にはログインが必要です。")
    }
}

function mini_serviceMessage() {
    alert("現在Service Messageの利用には審査承認が必要です。")
}

function mini_customAction() {
    if (liff.isLoggedIn()) {
        liff
            .shareTargetPicker(
                [
                    customActionButtonMessage
                ]
            )
    } else {
        alert("Custom Actionの利用にはログインが必要です。")
    }
}

const customActionButtonMessage = {
    "type": "flex",
    "altText": "代替テキスト",
    "contents":
    {
        "type": "bubble",
        "hero": {
            "type": "image",
            "url": location.href.replace(/\?.*$/,"") + "header.png",
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "Thanks!",
                            "size": "lg",
                            "color": "#000000",
                            "weight": "bold",
                            "wrap": true
                        }
                    ],
                    "spacing": "none"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "ご注文を承りました。",
                            "size": "sm",
                            "color": "#999999",
                            "wrap": true
                        }
                    ],
                    "spacing": "none"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "ピザ",
                                    "size": "sm",
                                    "color": "#555555",
                                    "wrap": false,
                                    "flex": 3
                                },
                                {
                                    "type": "text",
                                    "text": "× 1",
                                    "size": "sm",
                                    "color": "#111111",
                                    "wrap": false,
                                    "align": "end",
                                    "flex": 1
                                }
                            ],
                            "flex": 1,
                            "spacing": "sm"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "スパゲッティ",
                                    "size": "sm",
                                    "color": "#555555",
                                    "wrap": false,
                                    "flex": 3
                                },
                                {
                                    "type": "text",
                                    "text": "× 1",
                                    "size": "sm",
                                    "color": "#111111",
                                    "wrap": false,
                                    "align": "end",
                                    "flex": 1
                                }
                            ],
                            "flex": 1,
                            "spacing": "sm"
                        }
                    ],
                    "spacing": "sm",
                    "margin": "lg",
                    "flex": 1
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "ご注文詳細",
                                "uri": "https://liff.line.me/" + process.env.LIFF_ID + "/"
                            },
                            "style": "primary",
                            "height": "md",
                            "color": "#17c950"
                        },
                        {
                            "type": "button",
                            "action": {
                                "type": "uri",
                                "label": "Share",
                                "uri": "https://liff.line.me/" + process.env.LIFF_ID + "/"
                            },
                            "style": "link",
                            "height": "md",
                            "color": "#469fd6"
                        }
                    ],
                    "spacing": "xs",
                    "margin": "lg"
                }
            ],
            "spacing": "md"
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "separator",
                    "color": "#f0f0f0"
                },
                {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "image",
                            "url": location.href.replace(/\?.*$/,"") + "pizza_icon.png",
                            "flex": 1,
                            "gravity": "center"
                        },
                        {
                            "type": "text",
                            "text": "ほげほげピザ",
                            "flex": 19,
                            "size": "xs",
                            "color": "#999999",
                            "weight": "bold",
                            "gravity": "center",
                            "wrap": false
                        },
                        {
                            "type": "image",
                            "url": "https://vos.line-scdn.net/service-notifier/footer_go_btn.png",
                            "flex": 1,
                            "gravity": "center",
                            "size": "xxs",
                            "action": {
                                "type": "uri",
                                "label": "action",
                                "uri": "https://liff.line.me/" + process.env.LIFF_ID + "/"
                            }
                        }
                    ],
                    "flex": 1,
                    "spacing": "md",
                    "margin": "md"
                }
            ]
        }
    }
}
