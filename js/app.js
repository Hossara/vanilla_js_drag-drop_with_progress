(function() {
    const fileArea = document.getElementById("fileArea")
    const fileAreaText = document.querySelector("#fileArea > p")
    const fileInput = document.getElementById("fileInput")
    const fileValue = document.getElementById("fileValue")
    const submitBtn = document.getElementById("submitBtn")
    const uploadProgressBar = document.getElementById("uploadProgressBar")
    const uploadProgressLine = document.querySelector(".lpa_progress > div")
    const uploadProgressText = document.querySelector("#uploadProgressBar > p")

    let uploadStatus = false

    fileArea.addEventListener("click", () =>
    {
        if (!uploadStatus) fileInput.click()
    })

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileArea.addEventListener(eventName, (e) =>
        {
            e.preventDefault()
            e.stopPropagation()
        }, false)
    })

    fileArea.addEventListener("dragover", () =>
    {
        if (!uploadStatus)
        {
            fileAreaText.innerHTML = "<br/>Drop Here!<br/>"
            fileArea.classList.add("hvr")
        }
    })

    const dragLeave = () =>
    {
        if(!uploadStatus)
        {
            if (fileInput.files[0]) fileAreaText.innerHTML = fileInput.files[0].name
            else fileAreaText.innerHTML = "Click to upload or drag and drop<br/>mp3 file"
            fileArea.classList.remove("hvr")
        }
    }

    fileArea.addEventListener("dragleave", () => dragLeave())

    fileArea.addEventListener("drop", (ev) =>
    {
        if(!uploadStatus)
        {
            const fileBuffer = new DataTransfer()

            const fil_name = ev.dataTransfer.files[0].name.split(".")
            if (fil_name[fil_name.length - 1] === "mp3")
            {
                fileBuffer.items.add(ev.dataTransfer.files[0])

                fileInput.files = fileBuffer.files

                submitBtn.disabled = false
            }
            else alert("File type is not mp3!")

            dragLeave()
        }
    })

    fileInput.addEventListener("change", () =>
    {
        fileAreaText.innerHTML = fileInput.files[0].name

        if (fileInput.files[0])
        {
            submitBtn.disabled = false
        }
    })

    submitBtn.addEventListener("click", () =>
    {
        if (!uploadStatus)
        {
            if (fileInput.files[0])
            {
                uploadStatus = true
                uploadProgressBar.classList.remove("d-none")
                fileArea.classList.add("uploading")

                const formData = new FormData()
                formData.append("file", fileInput.files[0])

                axios.post('/server/upload.php', formData, {
                    onUploadProgress: function(progressEvent)
                    {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        uploadProgressLine.style.width = `${percentCompleted}%`
                        uploadProgressText.innerHTML = `${percentCompleted}% Uploaded`
                    }
                })
                .then(() => submitBtn.innerHTML = "Submit")
                .catch(err =>
                {
                    console.log(err)
                    alert("Something went wrong! Please try again.")
                    location.reload()
                })
            }
        }
        else if (fileArea.reportValidity()) fileArea.submit()
    })
})()