import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getDatabase, ref, set, remove, update, get, child, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { firebaseConfig } from 'https://cdn.jsdelivr.net/gh/Tokko-Blogger/Script@main/config.js';

export const botCommand = (currentID) => {

    let lang;
    const langCheker = async() => {
        let getLang;

        let currentLang;
        if(userLocale.state.last_lang == 'indonesia') {
            currentLang = 'indonesia'
        } else {
            currentLang = 'english';
        }
        lang = getLang[currentLang].Bot;
    }


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    const commandButton = document.createElement('div');
    commandButton.classList.add('btn-command');
    const commandIcon = document.createElement('button');
    commandIcon.classList.add('icon-command');
    commandIcon.innerHTML = `<i class="fa-light fa-robot"></i>`;
    const comamndDrag = document.createElement('i')
    comamndDrag.classList.add('fa-light', 'fa-grip-dots', 'drag-command');

    commandButton.append(commandIcon, comamndDrag);
    document.body.appendChild(commandButton);
    commandIcon.onclick = () => {
        if(!document.onmousemove) {
            createBotElement();
        }
    }
    
    let offset = [0,0];
    let isDown = false;
    comamndDrag.addEventListener('mousedown', function(e) {
        isDown = true;
        offset = [
            commandButton.offsetLeft - e.clientX,
            commandButton.offsetTop - e.clientY
        ];
    }, true);
    
    comamndDrag.addEventListener('touchstart', function(e) {
        isDown = true;
        let touch = e.touches[0] || e.changedTouches[0];
        offset = [
            commandButton.offsetLeft - touch.pageX,
            commandButton.offsetTop - touch.pageY
        ];
    }, true);

    comamndDrag.addEventListener('mouseup', function() {
        isDown = false;
    }, true);

    comamndDrag.addEventListener('touchend', function() {
        isDown = false;
    }, true);

    comamndDrag.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if (isDown) {
            commandButton.style.left = (e.clientX + offset[0]) + 'px';
            commandButton.style.top  = (e.clientY + offset[1]) + 'px';
        }
    }, true);
    
    comamndDrag.addEventListener('touchmove', function(e) {
        if (isDown) {
            let touch = e.touches[0] || e.changedTouches[0];
            commandButton.style.left = (touch.pageX + offset[0]) + 'px';
            commandButton.style.top  = (touch.pageY + offset[1]) + 'px';
        }
    }, true);

    var keys = {};

    const createBotElement = () => {
        const Bot = document.createElement('div');
        Bot.classList.add('Bot');
        Bot.innerHTML = (`
        <div class="Bot-Container">
            <div class="header">
                <i class="user-bot fa-light fa-robot"></i>
                <i class="command-close fa-duotone fa-circle-x"></i>
            </div>
            <div class="main">
                <div class="bot-chat">
                    <div class="command bot">
                        <span class="command-icon">
                            <i class="fa-thin fa-user-robot"></i>
                        </span>
                        <span class="command-message">
                        Welcome To <b>Tokko Chat</b> <a href='https://tokko-realtime.blogspot.com/'>@https://tokko-realtime.blogspot.com</a> if you need Please write down below:<br/><br/>
                            Type <span class="code">/help</span> for help<br/>
                           Press <span class="code">CTRL + ;</span> to Exit<br/>
                        </span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <input type="text" placeholder="/command Here" id="bot-input" />
                <button id="bot-button">
                    <i class="fa-solid fa-angles-right"></i>
                </button>
            </div>
        </div>
        `);
        const message_container = Bot.querySelector(`.Bot-Container .main .bot-chat`);

        if(document.querySelector('.container .Bot')) {
            document.querySelector('.container .Bot').remove();
        } else {
            document.querySelector('.container').appendChild(Bot);
        }

        Bot.querySelector('.command-close').onclick = () => Bot.remove();
        Bot.querySelector('.user-bot').onclick = () => window.location.href = window.location.origin + '/p/users.html?gid=bot';

        commandListener(message_container, Bot.querySelector('input'), Bot.querySelector('button'), Bot);

        Bot.querySelector('input').focus();
    }

    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Control",
            bubbles: true
        })
    );
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: ";",
            bubbles: true,
        })
    );
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;  
        if(keys['Control'] && keys[';']) {
            createBotElement();
        }
        
    });
    window.addEventListener('keyup', (e) => {
        if(keys['Control'] && keys[';']) {
            keys[e.key] = false;
            keys = {};
            if(document.querySelector('input')) {
                document.querySelector('input').value = '';
            }
        }
    });

    const commandListener = (chatBox, input, send, command_box) => {
        const commands = {
            last_used: null,
            nama: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Thinking...`;
                    if(!args[0])  {
                        line.innerHTML = `Usage:<br/>/nama get<br/>/nama set &lt;new_nama>`;
                        return box.appendChild(bot);
                    }

                    if(args[0] == 'get') {
                        let uname;
                        get(ref(db, 'users/' + currentID)).then((data) => {
                            uname = data.val().nama || data.val().displayName;
                            line.innerHTML = `Your Name is <b>${uname.replace(/\</g, '&lt;')}</b>`;
                        });
                    } else if(args[0] == 'set') {
                        if(!args[1]) {
                            line.innerHTML = `<span class="c-yellow">Enter nama</span>`;
                        } else if(args[2]) {
                            line.innerHTML = `<span class="c-red">User name Has Not</span>`;
                        } else {
                            update(ref(db, 'users/' + currentID), {nama: args[1]}).then(() => {
                                line.innerHTML = `<span class="c-green">nama Update <b>${args[1].replace(/\</g, '&lt;')}</b></span>`;
                            }).catch((err) => {
                                line.innerHTML = `<span class="c-red">nama Length</span>`;
                            })
                        }
                    } else {
                        line.innerHTML = `<span class="c-red"><b>${args[0].replace(/\</g, '&lt;')}</b> is Not Valid</span>`;
                    }
                    box.appendChild(bot);
                }
            },
            bio: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Thinking...`;
                    if(!args[0])  {
                        line.innerHTML = `Usage: <br/>/bio get<br/>/bio edit<br/>/bio remove`;
                        return box.appendChild(bot);
                    }
                    if(args[0] == 'get') {
                        get(ref(db, 'users/' + currentID)).then((data) => {
                            if(data.val().bio) {
                                line.innerHTML = `Your bio Section<br/><i class="code"></i>`;
                                line.querySelector('.code').innerText = data.val().bio;
                                box.scrollTop = box.scrollHeight;
                            } else {
                                line.innerHTML = `You Dont have any bio`;
                                box.scrollTop = box.scrollHeight;
                            }
                        });
                    } else if(args[0] == 'edit') {
                        line.innerHTML = `<i>Waiting . . .</i>`;
                        popup.prompt({
                            msg: 'bio:',
                            textarea: true,
                            max: 100,
                            onyes: (res) => {
                                if(res.length > 150) {
                                    line.innerHTML = `<span class="c-red">Please Enter less</span>`;
                                } else {
                                    update(ref(db, 'users/' + currentID), {bio: res}).then(() => {
                                        line.innerHTML = `<span class="c-green">update</span>`;
                                    }).catch((err) => {
                                        line.innerHTML = `<span class="c-red">please enter less</span>`;
                                    });
                                }
                            },
                            onno: () => {
                                line.innerHTML = `<span class="c-yellow">you cancled bio}</span>`;
                            }
                        })
                    } else if(args[0] == 'remove') {
                        commands.last_used = 'bio';
                        line.innerHTML = `Type <span class="code">/confirm</span> to clear bio`;
                    } else {
                        line.innerHTML = `<span class="c-red"><b>${args[0].replace(/\</g, '&lt;')}</b> is not valid</span>`;
                    }
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Removing...</span>`;
                    remove(ref(db, 'users/' + currentID + '/bio')).then(() => {
                        line.innerHTML = `<span class="c-green">Cleared</span>`;
                    })
                    box.appendChild(bot);
                }
            },
            realname: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Thinking...`;
                    if(!args[0])  {
                        line.innerHTML = `Usage: <br/>/realname get<br/>/realname edit<br/>/realname remove`;
                        return box.appendChild(bot);
                    }
                    if(args[0] == 'get') {
                        get(ref(db, 'users/' + currentID)).then((data) => {
                            if(data.val().realname) {
                                line.innerHTML = `Your realname Is<br/><i class="code"></i>`;
                                line.querySelector('.code').innerText = data.val().realname;
                                box.scrollTop = box.scrollHeight;
                            } else {
                                line.innerHTML = `You Dont have any realname`;
                                box.scrollTop = box.scrollHeight;
                            }
                        });
                    } else if(args[0] == 'edit') {
                        line.innerHTML = `<i>Waiting . . .</i>`;
                        popup.prompt({
                            msg: 'Your Realname is:',
                            textarea: true,
                            max: 100,
                            onyes: (res) => {
                                if(res.length > 150) {
                                    line.innerHTML = `<span class="c-red">Please Enter less</span>`;
                                } else {
                                    update(ref(db, 'users/' + currentID), {realname: res}).then(() => {
                                        line.innerHTML = `<span class="c-green">update</span>`;
                                    }).catch((err) => {
                                        line.innerHTML = `<span class="c-red">Please enter less</span>`;
                                    });
                                }
                            },
                            onno: () => {
                                line.innerHTML = `<span class="c-yellow">You cancled Edited Your Realname</span>`;
                            }
                        })
                    } else if(args[0] == 'remove') {
                        commands.last_used = 'realname';
                        line.innerHTML = `Type <span class="code">/confirm</span> to clear realname`;
                    } else {
                        line.innerHTML = `<span class="c-red"><b>${args[0].replace(/\</g, '&lt;')}</b> is not valid</span>`;
                    }
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Removing...</span>`;
                    remove(ref(db, 'users/' + currentID + '/realname')).then(() => {
                        line.innerHTML = `<span class="c-green">Cleared</span>`;
                    })
                    box.appendChild(bot);
                }
            },
            pesan: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Thinking...`;
                    if(!args[0])  {
                        line.innerHTML = `Usage: <br/>/pesan get<br/>/pesan edit<br/>/pesan remove`;
                        return box.appendChild(bot);
                    }
                    if(args[0] == 'get') {
                        get(ref(db, 'users/' + currentID)).then((data) => {
                            if(data.val().pesan) {
                                line.innerHTML = `Your pesan Is<br/><i class="code"></i>`;
                                line.querySelector('.code').innerText = data.val().pesan;
                                box.scrollTop = box.scrollHeight;
                            } else {
                                line.innerHTML = `You Dont have any pesan`;
                                box.scrollTop = box.scrollHeight;
                            }
                        });
                    } else if(args[0] == 'edit') {
                        line.innerHTML = `<i>Waiting . . .</i>`;
                        popup.prompt({
                            msg: 'Your pesan is:',
                            textarea: true,
                            max: 100,
                            onyes: (res) => {
                                if(res.length > 150) {
                                    line.innerHTML = `<span class="c-red">Please Enter less</span>`;
                                } else {
                                    update(ref(db, 'users/' + currentID), {pesan: res}).then(() => {
                                        line.innerHTML = `<span class="c-green">update</span>`;
                                    }).catch((err) => {
                                        line.innerHTML = `<span class="c-red">Please enter less</span>`;
                                    });
                                }
                            },
                            onno: () => {
                                line.innerHTML = `<span class="c-yellow">You cancled Edited Your pesan</span>`;
                            }
                        })
                    } else if(args[0] == 'remove') {
                        commands.last_used = 'pesan';
                        line.innerHTML = `Type <span class="code">/confirm</span> to clear pesan`;
                    } else {
                        line.innerHTML = `<span class="c-red"><b>${args[0].replace(/\</g, '&lt;')}</b> is not valid</span>`;
                    }
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Removing...</span>`;
                    remove(ref(db, 'users/' + currentID + '/realname')).then(() => {
                        line.innerHTML = `<span class="c-green">Cleared</span>`;
                    })
                    box.appendChild(bot);
                }
            },
            website: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Thinking...`;
                    if(!args[0])  {
                        line.innerHTML = `Usage: <br/>/website get<br/>/website edit<br/>/website remove`;
                        return box.appendChild(bot);
                    }
                    if(args[0] == 'get') {
                        get(ref(db, 'users/' + currentID)).then((data) => {
                            if(data.val().website) {
                                line.innerHTML = `Your website Is<br/><i class="code"></i>`;
                                line.querySelector('.code').innerText = data.val().website;
                                box.scrollTop = box.scrollHeight;
                            } else {
                                line.innerHTML = `You Dont have any website`;
                                box.scrollTop = box.scrollHeight;
                            }
                        });
                    } else if(args[0] == 'edit') {
                        line.innerHTML = `<i>Waiting . . .</i>`;
                        popup.prompt({
                            msg: 'Your website is:',
                            textarea: true,
                            max: 100,
                            onyes: (res) => {
                                if(res.length > 150) {
                                    line.innerHTML = `<span class="c-red">Please Enter less</span>`;
                                } else {
                                    update(ref(db, 'users/' + currentID), {website: res}).then(() => {
                                        line.innerHTML = `<span class="c-green">update</span>`;
                                    }).catch((err) => {
                                        line.innerHTML = `<span class="c-red">Please enter less</span>`;
                                    });
                                }
                            },
                            onno: () => {
                                line.innerHTML = `<span class="c-yellow">You cancled Edited Your website</span>`;
                            }
                        })
                    } else if(args[0] == 'remove') {
                        commands.last_used = 'website';
                        line.innerHTML = `Type <span class="code">/confirm</span> to clear website`;
                    } else {
                        line.innerHTML = `<span class="c-red"><b>${args[0].replace(/\</g, '&lt;')}</b> is not valid</span>`;
                    }
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Removing...</span>`;
                    remove(ref(db, 'users/' + currentID + '/realname')).then(() => {
                        line.innerHTML = `<span class="c-green">Cleared</span>`;
                    })
                    box.appendChild(bot);
                }
            },
            logout: {
                init: (args, line, bot, box) => {
                    commands.last_used = 'logout';
                    line.innerHTML = `Type <span class="code">/confirm</span> to Continue`;
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Logging out..</span>`
                    signOut(auth).then(() => {
                        window.location.href = `${window.location.origin}/p/login.html`;
                    });
                }
            },
            move: {
                init: (args, line, bot, box) => {
                    commands.last_used = 'move';
                    line.innerHTML = `If You write <b>Move</b> you will be redirect to Tokko Realtime and Logout on <b>Tokko Chat</b> too! <br/>Type <span class="code">/confirm</span> to Continue`;
                    box.appendChild(bot);
                },
                commit: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `<span class="c-yellow">Logging out And Move to <b>Tokko Realtime</b>..</span>`
                    signOut(auth).then(() => {
                        window.location.href = `https://tokko-realtime.blogspot.com/p/profile.html`;
                    });
                }
            },
            help: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Redirect To Team Support`;
                    box.appendChild(bot);
                    window.open(`https://cdn.jsdelivr.net/gh/Tokko-Blogger/Script@main/command_usage.json`);
                }
            },
            support: {
                init: (args, line, bot, box) => {
                    commands.last_used = null;
                    line.innerHTML = `Redirect To Team Support`;
                    box.appendChild(bot);
                    window.location.href = `https://tokko-gpt.blogspot.com/p/chat.html?r=user&gid=744011`;
                }
            },
            close: {
                init: () => {
                    command_box.remove();
                }
            },
            exit: {
                init: () => command_box.remove()
            },
            confirm : {
                init: (args, line, bot, box) => {
                    if(commands.last_used !== null) {
                        commands[commands.last_used].commit(args, line, bot, box);
                    }
                }
            }
        }
        input.onkeyup = (e) => {
            input.value = input.value.replace(/^ /g, '').replace(/  /g, ' ');
            if(e.key == 'Enter') send.click();
        }
        send.onclick = () => {
            if(input.value < 1) return;
            const args = input.value.replace(/^ /g, '').replace(/\//g, '').replace(/  /g, ' ').split(/ +/);
            const command = args.shift().toLowerCase();

            const userElement = document.createElement('div');
            userElement.classList.add('command', 'user');
            
            const userMessage = document.createElement('p');
            userMessage.classList.add('command-message');
            userMessage.innerText = '/'+input.value.replace(/^ /g, '').replace(/  /g, ' ').replace(/\//g, '');

            userElement.appendChild(userMessage);
            chatBox.appendChild(userElement);
            input.value = '';
            try {
                const botElement = document.createElement('div');
                botElement.classList.add('command', 'bot');
                botElement.innerHTML = (`<span class="command-icon"><i class="fa-thin fa-user-robot"></i></span> <span class="command-message"></span>`);
                const line = botElement.querySelector('.command-message');
                commands[command].init(args, line, botElement, chatBox);
                chatBox.scrollTop = chatBox.scrollHeight;
            } catch {
                const botElement = document.createElement('div');
                botElement.classList.add('command', 'bot');
                botElement.innerHTML = (`<span class="command-icon"><i class="fa-thin fa-user-robot"></i></span> <span class="command-message"><span class="c-red">Command Not Found</span></span>`);
                chatBox.appendChild(botElement);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
        
    }
}
