
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

rebind();

function showOverlay() {
    $('#overlay').removeClass('none');
    setTimeout(() => {
        $('#overlay').removeClass('opacity-0');
    },10);


    let createButton = $('#superPlayListAdd');
    if(createButton)
    {
        createButton.click(e => {
            $.post('/new',{
                name : $('#name').val(),
                desc : $('#desc').val()
            }, (d) => {
                if(d.status) 
                {
                    $('#listPage').load('/listPage', () => {
                        rebind();
                    });
                }
                else
                {
                    createButton.html(d.msg);
                }
            }) 
        })
    }

    let checked = false;
    let name = '';

    $('#music').on('change paste keyup',(e => {

        

        $('#addToPlayList').removeClass('green-light');
        let url = $('#music').val();
        if(url.indexOf('youtube') == -1)
            return;

        $.post('/check',{
            url : url
        }, (d) => {

            if(d.status) 
            {
                checked = true;
                name = d.name;
                $('#addToPlayList').addClass('green-light');
            }
            else
            {
                console.log('no such video');
            }

        })

    }));

    $('#addToPlayList').click(() => {sendTrack()});
    $('#music').keyup(e => {
        if(e.key == 'Enter')
        {
           sendTrack();
        } 
    })

    $('.supre-box-music-remove').click(e => {
        $.post('/remove',{
            id : e.currentTarget.id
        },(d) => {
            if(d.status)
            {
                $('#overlayLoad').load('/playlist?id='+ $('#addToPlayList').attr('super'), (d) => {
                    showOverlay();
                });
            }
            else
            {
                console.log('Error');
            }
        })
    })

    function sendTrack() {
        if(checked) 
        {
            let url = $('#music').val();
            $.post('/add',{
                link : url,
                name : name,
                id : $('#addToPlayList').attr('super')
            }, (d) => {
                if(d.status)
                {
                    $('#overlayLoad').load('/playlist?id='+ $('#addToPlayList').attr('super'), (d) => {
                        showOverlay();
                    });
                }
                else
                {
                    console.log('Error');
                }
            });
        }
    }
}

function closeOverlay() {
    $('#overlay').addClass('opacity-0');
    
    setTimeout(() => {
        $('#overlay').addClass('none');
    },200)
}



function rebind() {
    $('.overlay-closer').click(e => closeOverlay());

    
    $('.add-playlist').click(e => {
        $('#overlayLoad').load('/playlist', (d) => {
            console.log('empty');
            showOverlay();
        });
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
}
