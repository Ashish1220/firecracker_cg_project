
    const canvas1 = document.getElementById('myCanvas');
    const ctx1 = canvas1.getContext('2d');

    
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;

    // Background
    function drawBackground() {
        // Night sky
        ctx1.fillStyle = 'black';
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

        // Stars
        ctx1.fillStyle = 'white';
        
        updateStars();
        drawStars();
        

        // Moon
        ctx1.beginPath();
        ctx1.arc(150, 120, 50, 0, Math.PI * 2);
        ctx1.fillStyle = 'white';
        ctx1.fill();

        // Clouds
        moveClouds();
        // moveClouds();
    }

    // Clouds
    let cloudX = 0;

    function drawCloud(x, y) {
        ctx1.beginPath();
        ctx1.arc(x, y, 30, 0, Math.PI * 2);
        ctx1.arc(x + 40, y, 30, 0, Math.PI * 2);
        ctx1.arc(x + 80, y, 30, 0, Math.PI * 2);
        ctx1.arc(x + 120, y, 30, 0, Math.PI * 2);
        ctx1.arc(x + 160, y, 30, 0, Math.PI * 2);
        ctx1.fillStyle = 'grey';
        ctx1.fill();
    }
    let i=0.2;

    function moveClouds() {
        cloudX += 0.3;
        if (cloudX > canvas1.width + 200) {
            cloudX = -200;
        }
        i+=0.4;
        drawCloud(cloudX, 100);
        drawCloud(cloudX+350+i, 70);
        // drawCloud(cloudX - canvas1.width, 100);
        // drawCloud(cloudX + canvas1.width, 300);
    }

    // Buildings
    function drawBuilding(x, y, width, height) {
        // Building body
        ctx1.fillStyle = '#333';
        ctx1.fillRect(x, y - height, width+20, height);

        // Windows
        const numWindows = Math.floor(height / 40); // Number of windows based on building height
        const windowWidth = width / 5;
        const windowHeight = height / numWindows;
        let k=10;
        for (let i = 0; i < numWindows; i++) {
            ctx1.fillStyle = 'yellow';
            for (let j = 0; j < 4; j++) {
                ctx1.fillRect(x + j * (windowWidth + 10)+5 , y+k - height + i * windowHeight + 10, windowWidth, windowHeight-k);
            }
        //     ctx1.fillStyle = 'grey';
        // for (let j = 0; j < 4; j++) {
        //     ctx1.fillRect(x + j * (windowWidth + 10) + windowWidth + 5, y - height + i * windowHeight + 10, 2, 10);
        // }  
        //    k+=10;  
     }
    }

    // Draw scene
    const stars = [];
    const numStars = 100;
    
    // Create initial stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas1.width,
            y: Math.random() * canvas1.height/1.5,
            radius: Math.random() * 2,
            opacity: Math.random() * 0.5 + 0.5, // Random opacity between 0.5 and 1
            speed: Math.random() * 0.1 + 0.05 // Random speed between 0.05 and 0.15
        });
    }
    
    // Update stars
    function updateStars() {
        for (let i = 0; i < numStars; i++) {
            stars[i].opacity += stars[i].speed;
            if (stars[i].opacity > 1 || stars[i].opacity < 0.5) { // Reverse opacity when it reaches the limits
                stars[i].speed *= -1;
            }
        }
    }
    
    // Draw stars
    function drawStars() {
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        for (let i = 0; i < numStars; i++) {
            ctx1.beginPath();
            ctx1.arc(stars[i].x, stars[i].y, stars[i].radius, 0, Math.PI * 2);
            ctx1.fillStyle = 'rgba(255, 255, 255, ' + stars[i].opacity + ')';
            ctx1.fill();
        }
    }
    
    function drawScene() {
        
        // Buildings
        
        drawBackground();
        drawBuilding(100, canvas1.height, 100, 300);
        drawBuilding(250, canvas1.height, 140, 355);
        drawBuilding(500, canvas1.height, 100, 250);
        drawBuilding(1300, canvas1.height, 140, 355);
        drawBuilding(1050, canvas1.height, 100, 300);
        drawBuilding(1150, canvas1.height, 100, 250);
        

        requestAnimationFrame(drawScene);
    }
    // Animation loop
   drawScene()
   class Particle {
        constructor(x, y, radius, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
            this.opacity = 1;
            
        }

        draw() {
            ctx1.save();
            ctx1.globalAlpha = this.opacity;
            ctx1.fillStyle = this.color;
            ctx1.beginPath();
            ctx1.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx1.fill();
            ctx1.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.01;
        }
    }

    // Firecracker
    let firecracker = null;
    const particles = [];

    function createFirecracker(x,mouseY,y) {
        
        const rect = canvas1.getBoundingClientRect();



        ay=Math.abs(event.clientY );
        ax= event.clientX -(canvas1.width/2);
        angle=Math.atan(ay/ax);
        angle=(angle/Math.PI)*180;
        if(Math.abs(ax)<180){
            angle=0;
        }
     
        console.log(angle)


        return {

            angle:angle,
            x: canvas1.width/2,
            to_reach: x,
            y: y,
            startx:0,
            speed: 3,
            exploding: false,
            explosionRadius: 0,
            explosionColor: '#FFD700',
            mouse:mouseY,
            step_x:(global-(canvas1.width/2))/(canvas1.height-mouseY)

        };
    }

    function drawFirecracker() {
    if (firecracker !== null) {
        // Save the current state of the canvas1
        ctx1.save();
        angle=firecracker.angle;
        // Translate to the position of the firecracker
        ctx1.translate(firecracker.x, firecracker.y);

        // Rotate the canvas1 by the specified angle (in radians)
        ctx1.rotate(angle * Math.PI / 180);

        // Define gradient colors for the rocket body
        const gradient = ctx1.createLinearGradient(0, -25, 0, 25);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'orange');
        gradient.addColorStop(1, 'yellow');

        // Set the fill style to the gradient
        ctx1.fillStyle='red';
        // Draw rocket body (conical top)
        ctx1.beginPath();
        ctx1.moveTo(0, -30); // Top left corner
        ctx1.lineTo(20, -30); // Bottom left corner
        ctx1.lineTo(10, -50); // Top right corner
        
        ctx1.fillStyle = gradient;
        
        ctx1.moveTo(1.5, -30); // Top left corner
        ctx1.lineTo(1.5 ,  0); // Top right corner
        ctx1.lineTo(18.5, 0); // Bottom left corner
        ctx1.lineTo(18.5, -30); // Bottom left corner
        ctx1.fill();
        

        ctx1.closePath();


        // Draw rocket stick (rectangular bottom)
        ctx1.fillStyle = 'grey';
        ctx1.fillRect(3, 0, 4, 30); // Rectangle for stick

        // Restore the canvas1 state to its previous state
        ctx1.restore();
    }
}




    function animateFirecracker() {
        if (firecracker !== null) {
            
            if (!firecracker.exploding) {
              
                
                firecracker.x+=(firecracker.step_x)*(firecracker.speed);
                



                firecracker.y -= firecracker.speed;
                if (firecracker.y <firecracker.mouse) {
                    firecracker.exploding = true;
                    createExplosion(firecracker.x, firecracker.mouse);
                    document.getElementById('explosion-sound').play();
                }
            } else {
                // Explosion
                firecracker.explosionRadius += 2;
                if (firecracker.explosionRadius > 50) {
                    firecracker = null;
                }
            }
        }
        // drawScene();
    }

    function createExplosion(x, y) {
        for (let i = 0; i < 100; i++) {
            const speed = Math.random() * 5 + 1;
            const angle = Math.random() * Math.PI * 2;
            const speedX = Math.cos(angle) * speed;
            const speedY = Math.sin(angle) * speed;

            const r = Math.floor(Math.random() * 256)+10; // Random value between 0 and 255 for red
            const g = Math.floor(Math.random() * 256)+10; // Random value between 0 and 255 for green
            const b = Math.floor(Math.random() * 256)+20; // Random value between 0 and 255 for blue

    const color_p = `rgb(${r}, ${g}, ${b})`;

            particles.push(new Particle(x, y, 3, color_p, speedX, speedY));
        }
        // console.log(particles)
    }

    function drawParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
    }

    // Click event handler
    

    // Main draw function
    function draw() {
        // ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        
        drawFirecracker();
        animateFirecracker();
        drawParticles();

        requestAnimationFrame(draw);
        // drawBackground();
    }

    // Start animation
    let global;
    canvas1.addEventListener('click', function(event) {
        const rect = canvas1.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        global= mouseX ;
        firecracker = createFirecracker(mouseX,mouseY, canvas1.height);
    });
    draw();

    // Start animation
