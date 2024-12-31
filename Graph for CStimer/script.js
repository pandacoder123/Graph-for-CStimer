(async () => {
    const dbName = "cstimer";
    const objectStoreName = "sessions";
    let lastCheckTime = Date.now();
    let lastDataHash = null;
    let canvas;
    let myData = JSON.parse(localStorage.getItem("properties"));
    let lastSession = null;
    let currentSession;
    let previousSessionValue = myData?.session; // Track the previous session value

    // Rest of your style code remains the same...
    const style = document.createElement("style");
    style.textContent = `
        @font-face {
            font-family: 'lcd';
            src: url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff');
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(style);

    function fetchDataFromDatabase() {
        const dbRequest = indexedDB.open(dbName);

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction([objectStoreName], "readonly");
            const objectStore = transaction.objectStore(objectStoreName);
            const allTimes = [];

            let session1 = [];
            let session2 = [];
            let session3 = [];
            let session4 = [];
            let session5 = [];

            // Check if session has changed
            myData = JSON.parse(localStorage.getItem("properties"));
            const currentSessionValue = myData?.session;

            // If session changed, update the chart
            if (currentSessionValue !== previousSessionValue) {
                previousSessionValue = currentSessionValue;
                // Force chart update by clearing lastDataHash
                lastDataHash = null;
            }

            objectStore.openCursor().onsuccess = (cursorEvent) => {
                const cursor = cursorEvent.target.result;

                if (cursor) {
                    const value = cursor.value;

                    for (let i = 0; i < value.length; i++) {
                        if (cursor.key === "session_01_00") {
                            session1.push(cursor.value[i][0][1] / 1000);
                        }
                        if (cursor.key === "session_02_00") {
                            session2.push(cursor.value[i][0][1] / 1000);
                        }
                        if (cursor.key === "session_03_00") {
                            session3.push(cursor.value[i][0][1] / 1000);
                        }
                        if (cursor.key === "session_04_00") {
                            session4.push(cursor.value[i][0][1] / 1000);
                        }
                        if (cursor.key === "session_05_00") {
                            session5.push(cursor.value[i][0][1] / 1000);
                        }
                    }

                    function checkSession() {
                        if (typeof myData?.session === "undefined") {
                            currentSession = session1;
                        }
                        if (myData?.session === 2) {
                            currentSession = session2;
                        }
                        if (myData?.session === 3) {
                            currentSession = session3;
                        }
                        if (myData?.session === 4) {
                            currentSession = session4;
                        }
                        if (myData?.session === 5) {
                            currentSession = session5;
                        }
                    }
                    checkSession();
                    lastSession = currentSession;

                    cursor.continue();
                } else {
                    const currentDataHash = JSON.stringify(currentSession);

                    if (currentDataHash !== lastDataHash) {
                        lastDataHash = currentDataHash;
                        if (canvas) {
                            updateChart(currentSession);
                        } else {
                            createChart(currentSession);
                        }
                    }
                }
            };

            objectStore.openCursor().onerror = (errorEvent) => {
                console.error("Error reading data from sessions:", errorEvent);
            };
        };

        dbRequest.onerror = (errorEvent) => {
            console.error("Error opening IndexedDB:", errorEvent);
        };
    }

    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "none") {
            console.log("HIDDEN");
            document.getElementById("chartCanvas").style.display = "none";
        }
    }, 75);

    setInterval(() => {
        const scrambleDiv = document.getElementById("scrambleDiv");
        if (scrambleDiv.style.display === "block") {
            console.log("VISIBLE");
            document.getElementById("chartCanvas").style.display = "block";
            return;
        }
    }, 75);

    function createChart(times) {
        // Create and append a canvas element
        canvas = document.createElement("canvas");
        canvas.id = "chartCanvas"; // Full width

        canvas.style.backgroundColor = "transparent";
        canvas.style.width = "100%"; // Full width
        canvas.style.position = "absolute";
        canvas.style.bottom = "0";
        canvas.style.marginLeft = "13.5rem";
        canvas.style.zIndex = "1000";

        canvas.style.height = "12rem";
        document.body.appendChild(canvas);

        let fontColor = "#ffffff";
        let numColor = "grey";
        let xGrid = "black";
        let yGrid = "black";
        // Create the Chart.js line chart
        const ctx = canvas.getContext("2d");
        window.chart = new Chart(ctx, {
            color: "white",
            type: "line",
            data: {
                labels: times.map((_, index) => index + 1),
                datasets: [
                    {
                        label: "Times (seconds)",
                        data: times,
                        color: "rgb(255, 0, 0)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgb(255, 255, 255)",
                        borderWidth: 2,
                        font: {
                            family: "lcd",
                        },
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            color: fontColor,
                            font: {
                                size: 16,
                            },
                            text: "Attempt Number",
                        },
                        ticks: {
                            color: numColor, // Change the color of the x-axis labels to red
                        },
                        grid: {
                            color: xGrid, // Change the x-axis grid color
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            color: fontColor,
                            font: {
                                size: 16,
                            },
                            text: "Time (sec)",
                        },
                        ticks: {
                            color: numColor, // Change the color of the x-axis labels to red
                        },
                        grid: {
                            color: yGrid, // Change the x-axis grid color
                        },
                    },
                },
            },
        });
    }

    function updateChart(times) {
        // Update the existing chart with new data

        if (window.chart) {
            window.chart.data.datasets[0].data = times;
            window.chart.data.labels = times.map((_, index) => index + 1); // Update labels too
            window.chart.update(); // Trigger the chart to update
        }
    }

    // Set an interval to check for updates every second
    setInterval(fetchDataFromDatabase, 1000);
})();
