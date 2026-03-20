const banner= document.querySelector('.banner');
const text= banner.querySelector('.jelly_text');

//separate each letter so they move individually and not in unison
text.innerHTML=[...text.textContent].map(char=>char==' ' ? '&nbsp;':`<span>${char}</span>`).join('');
const letters = [...text.querySelectorAll('span')];

//letter movement force
const spring=0.08;
const mellow=0.80;

let mouseX=0;
let mouseY=0;
let mouseActive=false;

//map and move letters randomly
const letter_rand = letters.map(() => ({
    x:0,
    y:0,
    vx:0,
    vy:0,
    anchorX:0,
    anchorY:0,
    jiggleSpeed: Math.random()*2,
    jiggleOffset: Math.random()*Math.PI
}));

const bannerRect = banner.getBoundingClientRect();
letters.forEach((letter, i)=>{
    const rec = letter.getBoundingClientRect();
    letter_rand[i].anchorX = (rec.left + rec.width/2)- (bannerRect.left + bannerRect.width/2);
    letter_rand[i].anchorY = (rec.top + rec.height/2)- (bannerRect.top + bannerRect.height/2);

    letter_rand[i].anchorX *= 0.85;
});

//have letters move with mouse as event
banner.addEventListener('mousemove', (e) => {
    const rect = banner.getBoundingClientRect();
    mouseX = (e.clientX - rect.left)-rect.width/2;
    mouseY = (e.clientY - rect.top)-rect.height/2;
    mouseActive = true;
});

//when mouse leaves banner, have everything go back to normal
banner.addEventListener('mouseleave', () => {
    mouseActive = false;
});

function animate(){
    const rect = banner.getBoundingClientRect();
    const maxX = rect.width/2;
    const maxY = rect.height/2;

    letters.forEach((letter,i)=>{
        const rand = letter_rand[i];
        if(mouseActive){
            const randX = rand.x - mouseX;
            const randY = rand.y - mouseY;
            let dist = Math.sqrt(randX*randX + randY*randY);
            if(dist<150){
                const force = (150-dist)/150*5;
                rand.vx += (randX/dist) * force;
                rand.vy += (randY/dist) * force;
            }
            const jiggle = Math.sin(performance.now()*0.002*rand.jiggleSpeed+rand.jiggleOffset);
            rand.vx+=jiggle*0.5;
            rand.vy+=jiggle*0.5;
        }
    });

    const minDist=22;
    for(let i = 0; i <letters.length; i++){
        for(let j = i+1; j<letters.length; j++){
            const a=letter_rand[i];
            const b=letter_rand[j];
            let randX = a.x - b.x;
            let randY = a.y - b.y;
            let dist = Math.sqrt(randX*randX + randY*randY);
            if(dist<minDist){
                const push = (minDist-dist)/2;
                const newX = (randX/dist)||0;
                const newY = (randY/dist)||0;
                a.vx += newX*push;
                a.vy += newY*push;
                b.vx -= newX*push;
                b.vy -= newY*push;
            }
        }
    }

    let avgX=0;
    let avgY=0;

    letters.forEach((letter,i)=>{
        const rand = letter_rand[i];
        rand.vx += (rand.anchorX-rand.x)*spring;
        rand.vy += (rand.anchorY-rand.y)*spring;
        rand.vx *= mellow;
        rand.vy *= mellow;
        rand.x += rand.vx;
        rand.y += rand.vy;

        if(rand.x>maxX){
            rand.x=maxX;
            rand.vx *=-0.5;
        }
        if(rand.x<-maxX){
            rand.x=-maxX;
            rand.vx *=-0.5;
        }
        if(rand.y>maxY){
            rand.y=maxY;
            rand.vy *=-0.5;
        }
        if(rand.y<-maxY){
            rand.y=-maxY;
            rand.vy *=-0.5;
        }

        avgX += rand.x;
        avgY += rand.y;
        const scaleX = 1+Math.min(Math.abs(rand.vx)/15, 0.5);
        const scaleY = 1-Math.min(Math.abs(rand.vy)/30, 0.3);
        letter.style.transform=`translate(${rand.x}px,${rand.y}px) scale(${scaleX},${scaleY})`;
    });

    requestAnimationFrame(animate);
}

animate();

//js to make modal more readible in HTML
document.querySelectorAll(".modalLink").forEach(link=>{
    link.addEventListener("click", e=>{
        e.preventDefault();
        const linkName = link.dataset.modal;
        const modal = document.getElementById(linkName);

        modal.style.display = "block";
    });
});

document.querySelectorAll(".close").forEach( click => {
    click.addEventListener("click",()=>{
        click.closest(".modal").style.display = "none";
    });
});

window.addEventListener("click",e=>{
    if(e.target.classList.contains("modal")){
        e.target.style.display="none";
    }
});
