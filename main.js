// Initialize Firebase
var config = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};
firebase.initializeApp(config);

const surfAppReference = firebase.database()


$(document).ready(function(){

    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const btnSignIn = document.getElementById('sign-in')
    const btnRegister = document.getElementById('register')

    // add event listener to login and register to enable buttons
    eventListenerSignInRegisterBtn()

    // sign in
    btnSignIn.addEventListener('click', function(){
        const emailVal = email.value
        const passVal = password.value

        const auth = firebase.auth()

        // sign in
        const promise = auth.signInWithEmailAndPassword(emailVal, passVal)
        promise.catch(e => alert(e.message))
    })

    // register
    btnRegister.addEventListener('click', function(){

        const emailVal = email.value
        const passVal = password.value
        
        if (emailVal.length === 0 || passVal.length === 0) {
            // alert('You must input something')
        }
        else{
            const auth = firebase.auth()

            // sign in
            const promise = auth.createUserWithEmailAndPassword(emailVal, passVal)
            promise.catch(e => alert(e.message))
        }
    })

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            // window.open("index.html", "_self")
            document.getElementById('sign-in-form').style.display = "none"
            document.getElementById('blog-content').style.display = "block"
            
        }
        else {
            document.getElementById('sign-in-form').style.display = "block"
            document.getElementById('blog-content').style.display = "none"
        }
    })

    // Hide comment box until user selects a surf break
    document.getElementById("message-form").style.display="none";
    // document.getElementById("image-comment-section").style.display="none";

    // Show & hide drop down
    $('#dropdownMenuButton').click(function(){
        $('#dropdownMenuButton').attr('aria-expanded', "true")
        $('#main-dropdown').attr('class', 'show')

    })

    $('#message').keyup(function(){
        let msg = $('#message').val()
        if(msg.length > 0){
            $('#submit-button').removeAttr('disabled')
        }
        else{
            $('#submit-button').attr('disabled', true)
        }
        
    })

    $("#logout").click(function(){
        firebase.auth().signOut()
        // window.open("signIn.html", "_self")
        document.getElementById('sign-in-form').style.display = "block"
        document.getElementById('blog-content').style.display = "none"

        document.getElementById("image-comment-section").style.display="none";
        document.getElementById("message-form").style.display="none";
        document.getElementById("comments").style.display="none";
    })

    // Add event listener to each drop down
    const $dropDownItems = $('.dropdown-item')
    for (let i=0; i<$dropDownItems.length; i++){
        $dropDownItems.eq(i).click(function(){
            if ($dropDownItems.get(i).id === "pipeline") {
                $('#dropdownMenuButton').attr('aria-expanded', "false")
                $('#main-dropdown').attr('class', 'dropdown-menu')

                 // Clear comment box
                 $('#message').val('')

                // Show comment box
                document.getElementById("message-form").style.display="block";

                showPipeline()

                addPipelineComments()
            }
            else if ($dropDownItems.get(i).id === "pacific-beach") {
                $('#dropdownMenuButton').attr('aria-expanded', "false")
                $('#main-dropdown').attr('class', 'dropdown-menu')

                // Clear comment box
                $('#message').val('')

                // Show comment box
                document.getElementById("message-form").style.display="block";

                showPacificBeach()

                addPacificBeachComments()
            }
            else if ($dropDownItems.get(i).id === "matunuck") {
                $('#dropdownMenuButton').attr('aria-expanded', "false")
                $('#main-dropdown').attr('class', 'dropdown-menu')

                // Clear comment box
                $('#message').val('')

                // Show comment box
                document.getElementById("message-form").style.display="block";

                showMatunuck()

                addMatunuckComments()
            }
        })
    }

    $('#message-form').submit(function(evt){
        evt.preventDefault()

        // Grab the user message input
        const message = $('#message').val()
        
        // Clear the input box
        $('#message').val('')

        const picId = $('img').prop('id')
        let tableName
        if (picId === 'pipeline-pic') {
            tableName = 'pipeline_comments'
        }
        else if (picId === 'pacific-beach-pic') {
            tableName = 'pacific_beach_comments'
        }
        else if (picId === 'matunuck-pic') {
            tableName = 'matunuck_comments'
        }
        // Send message to DB in the desired tableName
        const newComment = surfAppReference.ref(tableName)
        newComment.push({
            comment: message,
            likes: 0
        })
    })    
})

function showPipeline(){
    document.getElementById("image-comment-section").style.display="block"
    $('#image-comment-section').html('')
    $('#image-comment-section').append("<img id='pipeline-pic' src='pipeline.jpg'>")
}

function showPacificBeach(){
    document.getElementById("image-comment-section").style.display="block"
    $('#image-comment-section').html('')
    $('#image-comment-section').append("<img id='pacific-beach-pic' src='tourmaline.jpg'>")
}

function showMatunuck(){
    document.getElementById("image-comment-section").style.display="block"
    $('#image-comment-section').html('')
    $('#image-comment-section').append("<img id='matunuck-pic' src='matunuck.jpg'>")
}

function addPipelineComments(){

    // empty the comment board
    $('.comment-board').html('')
    $('#comments').css('display', 'inline')
    surfAppReference.ref('pipeline_comments').on('value', function(results){
        const $commentBoard = $('.comment-board')
        const comments = []

        const allComments = results.val()

        for(let comm in allComments) {
            const comment = allComments[comm].comment
            let likes = allComments[comm].likes
            // Create li for comment
            const $commentElement = $('<li></li>')
            $commentElement.text(comment)

            // up likes
            const $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>')
            $upVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('pipeline_comments/'+id)
                likes ++
                commentRef.update({
                    likes: likes
                })
            })

            // down likes
            const $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')
            $downVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('pipeline_comments/'+id)
                likes --
                commentRef.update({
                    likes: likes
                })
            })

            $commentElement.attr('data-id', comm)
            $commentElement.append($upVoteElement)
            $commentElement.append('<div class="pull-right">' + likes + '</div>')
            $commentElement.append($downVoteElement)

            comments.push($commentElement)
        }
        $commentBoard.empty()
        for(let i in comments) {
            $commentBoard.append(comments[i])
        }
    })
}

function addPacificBeachComments(){
    // empty the comment board
    $('.comment-board').html('')
    $('#comments').css('display', 'inline')
    surfAppReference.ref('pacific_beach_comments').on('value', function(results){
        const $commentBoard = $('.comment-board')
        const comments = []

        const allComments = results.val()

        for(let comm in allComments) {
            const comment = allComments[comm].comment
            let likes = allComments[comm].likes
            // Create li for comment
            const $commentElement = $('<li></li>')
            $commentElement.text(comment)

            // likes
            const $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>')
            $upVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('pacific_beach_comments/'+id)
                likes ++
                commentRef.update({
                    likes: likes
                })
            })

            // down likes
            const $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')
            $downVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('pacific_beach_comments/'+id)
                likes --
                commentRef.update({
                    likes: likes
                })
            })

            $commentElement.attr('data-id', comm)
            $commentElement.append($upVoteElement)
            $commentElement.append('<div class="pull-right">' + likes + '</div>')
            $commentElement.append($downVoteElement)

            comments.push($commentElement)

        }
        $commentBoard.empty()
        for(let i in comments) {
            $commentBoard.append(comments[i])
        }
    })
}

function addMatunuckComments(){
    // empty the comment board
    $('.comment-board').html('')
    $('#comments').css('display', 'inline')
    surfAppReference.ref('matunuck_comments').on('value', function(results){
        const $commentBoard = $('.comment-board')
        const comments = []

        const allComments = results.val()

        for(let comm in allComments) {
            const comment = allComments[comm].comment
            let likes = allComments[comm].likes
            // Create li for comment
            const $commentElement = $('<li></li>')
            $commentElement.text(comment)

            // likes
            const $upVoteElement = $('<i class="fa fa-thumbs-up pull-right"></i>')
            $upVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('matunuck_comments/'+id)
                likes ++
                commentRef.update({
                    likes: likes
                })
            })
            // down likes
            const $downVoteElement = $('<i class="fa fa-thumbs-down pull-right"></i>')
            $downVoteElement.on('click', function(e){
                const id = $(e.target.parentNode).data('id')
                const commentRef = surfAppReference.ref('matunuck_comments/'+id)
                likes --
                commentRef.update({
                    likes: likes
                })
            })

            $commentElement.attr('data-id', comm)
            $commentElement.append($upVoteElement)
            $commentElement.append('<div class="pull-right">' + likes + '</div>')
            $commentElement.append($downVoteElement)

            comments.push($commentElement)

        }
        $commentBoard.empty()
        for(let i in comments) {
            $commentBoard.append(comments[i])
        }
    })
    
}

function eventListenerSignInRegisterBtn(){
    $('#email').on('keyup', function() {
        if ($('#email').val() != 0 &&
        $('#password').val() != 0){
            $("#sign-in").removeAttr("disabled")
            $("#register").removeAttr("disabled")
        }
        else {
            $("#sign-in").attr("disabled", true)
            $("#register").attr("disabled", true)
        }
    })

    $('#password').on('keyup', function() {
        if ($('#email').val() != 0 &&
        $('#password').val() != 0){
            $("#sign-in").removeAttr("disabled")
            $("#register").removeAttr("disabled")
        }
        else {
            $("#sign-in").attr("disabled", true)
            $("#register").attr("disabled", true)
        }
    })
}