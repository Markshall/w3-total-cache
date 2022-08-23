jQuery(document).ready(function($) {
	function w3tcps_analyze(page_post, nocache) {
        let page_post_id = page_post.find('.page_post_url').attr('page_post_id');
        let page_post_url = page_post.find('.page_post_url').attr('page_post_url');

        $('.w3tcps_analyze').prop('disabled',true);
        page_post.find('.page_post_psresults').fadeOut('fast');
        page_post.find('.w3tcps_loading').removeClass('w3tc_none');
		page_post.find('.w3tcps_error').addClass('w3tc_none');

		$.ajax({
            type: 'GET',
            url: ajaxurl + '?action=w3tc_ajax&_wpnonce=' + w3tc_nonce + '&w3tc_action=pagespeed_data&url=' + encodeURIComponent( page_post_url ) + (nocache ? '&cache=no' : ''),
            dataType: 'json',
            success: function(data){
				$('.w3tcps_analyze').prop('disabled',false);
                $('#' + page_post_id).prev().find('.w3tcps_loading').addClass('w3tc_none');
				if (data.error) {
					$('#' + page_post_id).prev().find('.w3tcps_error p').html( w3tcData.lang.pagespeed_data_error + data.error );
           			$('#' + page_post_id).prev().find('.w3tcps_error').removeClass( 'w3tc_none' );
	        		return;
		        }
    			$('#' + page_post_id).html(data['.w3tcps_content']).fadeIn('slow');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('.w3tcps_analyze').prop('disabled',false);
				$('#' + page_post_id).prev().find('.w3tcps_error p').html( w3tcData.lang.pagespeed_data_error + errorThrown );
                $('#' + page_post_id).prev().find('.w3tcps_error').removeClass('w3tc_none');
                $('#' + page_post_id).prev().find('.w3tcps_loading').addClass('w3tc_none');
            },
            async: true
        });
    }

    function w3tcps_breakdown_items_toggle() {
        $(this).toggleClass("chevron_up chevron_down");
        $(this).next().slideToggle();
    }
   
    $(document).on('click', '.w3tcps_breakdown_items_toggle', w3tcps_breakdown_items_toggle);

    function w3tcps_mobile_toggle() {
		$('#w3tcps_control_desktop').removeClass('nav-tab-active');
        $('#w3tcps_desktop').hide();
		$('#w3tcps_control_mobile').addClass('nav-tab-active');
		$('#w3tcps_mobile').show();
    }

	$(document).on('click', '#w3tcps_control_mobile', w3tcps_mobile_toggle);

    function w3tcps_desktop_toggle() {
		$('#w3tcps_control_mobile').removeClass('nav-tab-active')
		$('#w3tcps_mobile').hide();
		$('#w3tcps_control_desktop').addClass('nav-tab-active');
		$('#w3tcps_desktop').show();
    }

    $(document).on('click', '#w3tcps_control_desktop', w3tcps_desktop_toggle);

	function w3tcps_audit_filter( event ) {
		event.preventDefault();
		if ( 'ALL' === $(this).text() ) {
			$( '.w3tcps_breakdown .audits' ).show();
		} else if ( $(this).text().trim ) {
			$( '.w3tcps_breakdown .audits' ).hide();
			$( '.w3tcps_breakdown .' + $( this).text() ).delay(200).show();
		} else {
			$( '.w3tcps_breakdown .audits' ).show();
			alert( w3tcData.lang.pagespeed_filter_error );
		}
    }

	$(document).on('click', '.w3tcps_audit_filter', w3tcps_audit_filter);

    $('.w3tcps_content').on('click', '.w3tcps_analyze', function() {
		w3tcps_analyze($(this).closest('.page_post'),true);
	});

	w3tcps_analyze($('#w3tcps_home .page_post'), false);
});