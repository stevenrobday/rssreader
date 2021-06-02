jQuery(document).foundation();
/*
These functions make sure WordPress
and Foundation play nice together.
*/
jQuery(document).ready(function () {// Remove empty P tags created by WP inside of Accordion and Orbit
    jQuery('.accordion p:empty, .orbit p:empty').remove();// Adds Flex Video to YouTube and Vimeo Embeds
    jQuery('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').each(function () {
        if (jQuery(this).innerWidth() / jQuery(this).innerHeight() > 1.5) {
            jQuery(this).wrap("<div class='widescreen responsive-embed'/>");
        } else {
            jQuery(this).wrap("<div class='responsive-embed'/>");
        }
    });
});

/*
Insert Custom JS Below
*/

let classes = jQuery("body").attr('class');

if (classes.indexOf('single-post') >= 0) {

    // MEDIA ATTACHMENT FOOTER

    let container = jQuery('<div/>', {
        class: 'single_post_info_container'
    });
    let title = jQuery('.entry-title').text();
    let titleDiv = jQuery('<div/>', {
        class: 'single_post_title',
        text: title
    });
    let datePostedArray = jQuery('.byline').text().trim().split(' ');
    let date = Date.parse(datePostedArray[2] + ' ' + datePostedArray[3] + ' ' + datePostedArray[4]);
    let options = {year: 'numeric', month: 'short', day: 'numeric'};
    let dateString = new Intl.DateTimeFormat('en-US', options).format(date);
    let dateCommentsDiv = jQuery('<div/>', {
        class: 'single_post_date_comments',
        html: dateString + ' | <i class="far fa-comment-alt"></i> Comments'
    });
    let savedDiv = jQuery('<div/>', {
        class: 'single_post_saved',
        html: '<i class="far fa-bookmark"></i> Save'
    });
    container.append(titleDiv);
    container.append(dateCommentsDiv);
    container.append(savedDiv);

    let content = jQuery('.entry-content');
    jQuery(document).ready(function () {
        let videoPage = jQuery('.entry-content > p:nth-child(2) .widescreen');
        let imagePage = jQuery('.entry-content > div:nth-child(2):has(img)');
        let insertAfter = videoPage.length ? videoPage :
                        imagePage.length ? imagePage : false;

        if (insertAfter)
            container.insertAfter(insertAfter);
        else {
            let img1 = jQuery('.entry-content > img:first-child');
            let img2 = jQuery('.entry-content > div:first-child .ff-og-image-inserted');
            let img = img1.length ? img1 :
                img2.length ? img2 : false;
            if (img) {
                let imgContainer = jQuery('<div/>', {
                    class: 'single-image-container'
                });
                imgContainer.append(img);
                jQuery('.entry-content').prepend(imgContainer);
                container.insertAfter(imgContainer);

                //hide broken images
                IsValidImage(imgContainer, img.attr('src'));
                if (img.attr('width') === '1') HideImage(imgContainer);
            }
            else {
                content.prepend(container);
            }
        }
    });

    // COMMENTS SECTION
    // #Header
    let headerContainer = jQuery('<div/>', {
        class: 'comments_section_header'
    });

    jQuery('<div/>', {
        html: '<i class="far fa-comment-alt"></i>'
    }).appendTo(headerContainer);
    jQuery('<div/>', {
        html: '<i class="far fa-bookmark"></i>'
    }).appendTo(headerContainer);
    jQuery('<div/>', {
        html: '<i class="fas fa-share-alt"></i>'
    }).appendTo(headerContainer);

    content.append(headerContainer);

    // #Comments

    let inputContainer = jQuery('<div/>', {
        class: 'comments_section_input_container',
        html: '<i class="fas fa-paper-plane"></i>'
    });

    jQuery('<input/>', {
        placeholder: 'Comment'
    }).appendTo(inputContainer);

    content.append(inputContainer);

}

jQuery('.feedly_multiple li').each(function () {
    let post = jQuery(this);
    let a = post.find('a');
    let image = post.find('.wp-block-latest-posts__featured-image img');

    let link = jQuery('<a/>', {
        href: a.attr('href'),
        class: 'feedly_image_bg'
    });

    if (image.length) {
        let img = jQuery('<img/>', {
            src: image.attr('src')
        });
        link.append(img);
    }

    link.prependTo(post[0]);

    let time = post.find('time');
    let date = new Date(time.attr('datetime'));
    let options = {year: 'numeric', month: 'short', day: 'numeric'};
    let dateString = new Intl.DateTimeFormat('en-US', options).format(date);
    jQuery('<div/>', {
        class: 'feedly_date_comments',
        html: dateString + ' | <i class="far fa-comment-alt"></i> Comments'
    }).appendTo(post[0]);
});

// functions to check for and hide broken images
function IsValidImage(imgContainer, url) {
    jQuery("<img>", {
        src: url,
        error: function () {
            HideImage(imgContainer);
        }
    });
}

function HideImage(imgContainer) {
    imgContainer.css('display', 'none');
}
