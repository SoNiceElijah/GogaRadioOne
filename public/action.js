
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();

}

let offset0 = 0;
let offset1 = 80;

let textWidth = 200;
let textHeight = 40;

resizeCanvas();

//Game loop
setInterval(() => {
    draw();
},16)



function draw() {    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "24px Indie Flower";
    ctx.fillStyle  = "#555555";

    for(let i = -1; i < (window.innerWidth / textWidth) + 1; ++i)
    {
        for(let j = -1; j < window.innerHeight / textHeight; ++j)
        {
            if(j === 5 && i === 5)
            {
                ctx.fillText('WHATA FACK IS IT', offset1 + textWidth * i, textHeight * j);
                continue;
            }

            if(j === 11 && i === 1)
            {
                ctx.fillText('J O P E N K A', offset1 + textWidth * i, textHeight * j);
                continue;
            }

            if(j % 2 == 0)
                ctx.fillText('SO NICE ELIJAH', offset0 + textWidth * i, textHeight * j );
            else
                ctx.fillText('NICE GAY ORGYI', offset1 + textWidth * i, textHeight * j );
        }
    }

    offset0 += 0.2;
    offset1 += 0.2;

    if(offset0 >= textWidth)
        offset0 = 0;

    if(offset1 >= textWidth)
        offset1 = 0;

}

$('#showList').click((e) => {
    $('#indexPage').addClass('opacity-0');
    setTimeout(() => {
        $('#indexPage').addClass('none');
        $('#listPage').removeClass('deep');
    },200);
});

$('#backButton').click((e) => {
    $('#indexPage').removeClass('none');
    setTimeout(() => {
        $('#indexPage').removeClass('opacity-0');
        $('#listPage').addClass('deep');
    },10);
});

$('.list-item').click(e => {
    $('#overlayLoad').load('/playlist?id='+ e.currentTarget.id, (d) => {
        console.log('With data');
        showOverlay();
    });
});

$('.add-playlist').click(e => {
    $('#overlayLoad').load('/playlist', (d) => {
        console.log('empty');
        showOverlay();
    });
})

function showOverlay() {
    $('#overlay').removeClass('none');
    setTimeout(() => {
        $('#overlay').removeClass('opacity-0');
    },10);

    $('#music').keyup(e => {
        if(e.key == 'Enter')
        {
            let url = $('#music').val();
            $.post('/check',{
                url : url
            }, (d) => {
                if(d.status)
                {
                    addMusic(d.name,url);
                    $('#music').val('');
                }
                else
                {
                    $('#music').val('');
                }
            });
        }
    })
}

function closeOverlay() {
    $('#overlay').addClass('opacity-0');
    
    setTimeout(() => {
        $('#overlay').addClass('none');
    },200)
}

$('.overlay-closer').click(e => closeOverlay());

function addMusic(name,link) {

    $('#tmp_box .super-box-music-name').html(name);
    $('#tmp_box .super-box-music-link').html(link);
    $('#tmp_box .super-box-music-link').attr('href',link);

    let el = $('#tmp_box').clone();
    el.attr('id',"2222222");


    $('#musicList #music').before(el);
}

