document.addEventListener("DOMContentLoaded", function (event) {
       function OTPInput() {
         const inputs = document.querySelectorAll('#otp > *[id]');
     
         for (let i = 0; i < inputs.length; i++) {
           inputs[i].addEventListener('keydown', function (event) {
             if (event.key === "Backspace") {
               inputs[i].value = '';
               if (i !== 0) inputs[i - 1].focus();
             } else if (event.key === "ArrowLeft" || event.key === "Left") {
               // Corrected the condition to handle left arrow key
               if (i !== 0) inputs[i - 1].focus();
             } else {
               if (i === inputs.length - 1 && inputs[i].value !== '') {
                 return true;
               } else if (event.keyCode >= 47 && event.keyCode <= 58) {
                 inputs[i].value = event.key;
                 if (i !== inputs.length - 1) inputs[i + 1].focus();
                 event.preventDefault();
               } else if (event.keyCode >= 64 && event.keyCode <= 91) {
                 inputs[i].value = String.fromCharCode(event.keyCode);
                 if (i !== inputs.length - 1) inputs[i + 1].focus();
                 event.preventDefault();
               }
             }
           });
         }
       }
     
       OTPInput();
     });
     
//resend button configuration


function startOtpTimer(duration , displayElementId){

       let timer  = duration;
       const displayElement = document.getElementById(displayElementId)
       const countdownInterval = setInterval(function () {
              const minutes = Math.floor(timer / 60);
              const seconds = timer % 60;

              displayElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

              if (--timer < 0) {
                     clearInterval(countdownInterval);
                     displayElement.textContent = "Resend OTP";
                     displayElement.disabled = false; // Enable the button after timer ends
              }
       }, 1000);
} 

startOtpTimer(30,'resend');

//listening for a click in resend button

document.getElementById('resend').addEventListener('click',()=>{
       const data = {
             
       }
       fetch('/user/resendOtp', {
              method: 'POST', // Use POST for sending data
              headers: {
                     'Content-Type': 'application/json',
              },
       })
       .then(response => response.json())
       .catch((error) => {
              console.error('Error:', error);
       });

})