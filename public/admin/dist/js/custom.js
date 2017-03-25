$(window).ready(function(){
    //Config toastr
    toastr.options = {
        "closeButton": true,
    };

    $('span.time').each(function() {
        let item = $(this);
        let time = item.data('time'),
            format = item.data('format');
        item.html(moment(time).format(format));
    });

    let deleteButton = $('#multipleDelete-btn'),
        mainTable = $('table.main-table'),
        tdCheckbox = mainTable.find('td input[type=checkbox]');
    let changeDeleteButtonStatus = function (status) {
        if (status) {
            deleteButton.removeClass('disabled');
        } else {
            deleteButton.addClass('disabled');
        }
    };
    mainTable.find('thead th:first-child').on('change', 'input[type=checkbox]', function() {
        tdCheckbox.prop('checked', $(this).prop('checked'));
    });

    mainTable.on('change', 'input[type=checkbox]', function () {
        let hasCheckboxChecked = false;
        let tdCheckbox = mainTable.find('td input[type=checkbox]');
        tdCheckbox.each(function() {
            if ($(this).prop('checked') === true){
                return hasCheckboxChecked = true;
            }
        });
        changeDeleteButtonStatus(hasCheckboxChecked);
    });

    deleteButton.on('click', function () {
        $('#multipleDelete').submit();
    });

    //date range picker
    $('.date-range-picker').each(function() {
        $(this).dateRangePicker({
            format: 'DD/MM/YYYY',
            separator: ' - '
        });
    });

    //submit main form
    $('#submitMainForm').on('click', function () {
        $('#main-form').submit();
    });

    // Init Editor
    //CKEDITOR
    $('textarea.editor').each(function () {
        let editorId = $(this).attr('id');
        if (editorId) {
            CKEDITOR.replace(editorId);
        }
    });

    /**
     * Media Popup Js
     */
    //Get media
    function getMedia(page) {
        $.get('/admin/media/api/all',
            {
                page: page
            },
            function (data, result) {
                ModalBody.empty();
                totalPages = data.pages;
                for (let image of data.docs) {
                    ModalBody.append(`<a class="img-thumb" data-id="${image._id}" data-path="${image.path}" data-ext="${image.ext}"><img src="/uploads/${image.path}-150x150${image.ext}"></a>`)
                }
            }
        )
    }
    //Media Popup
    let MediaPopup = $('#MediaPopup'),
        ModalBody = MediaPopup.find('.modal-body'),
        mediaPage = 1,
        totalPages = 1,
        action = '',
        targetid = '';
    MediaPopup.on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);
        action = button.data('action');
        targetid = button.data('targetid');
        getMedia(mediaPage)
    });
    MediaPopup.on('click', 'a.img-thumb', function () {
        MediaPopup.find('a.img-thumb').removeClass('selected');
        $(this).addClass('selected');
    });

    //applyImage
    $('#applyImage').on('click', function () {
        let imgPath = ModalBody.find('a.img-thumb.selected').data('path'),
            imgExt = ModalBody.find('a.img-thumb.selected').data('ext'),
            imgId = ModalBody.find('a.img-thumb.selected').data('id'),
            imgSize = $('#imgSize').val() || 'full',
            imgSizeCovert = {full: '', thumb: '-150x150'};
        switch (action) {
            case 'add-img-to-editor':
                CKEDITOR.instances[targetid].insertHtml(`<img src='/uploads/${imgPath}${imgSizeCovert[imgSize]}${imgExt}' />`);
                break;
            case 'single':
                let target = $('#' + targetid);
                target.find('img').remove();
                target.append(`<img src='/uploads/${imgPath}-150x150${imgExt}' />`);
                target.find('input[name=image]').val(imgPath+imgExt);
                break;
        }
        MediaPopup.modal('hide');
    });

    $('.media-navigation button').on('click', function () {
        mediaPage += Number($(this).data('value'));
        if (mediaPage <= 1) {
            mediaPage = 1;
            $('.media-navigation button.prev').attr('disabled', true);
        } else {
            $('.media-navigation button.prev').removeAttr('disabled');
        }

        if (mediaPage >= totalPages) {
            mediaPage = totalPages;
            $('.media-navigation button.next').attr('disabled', true);
        } else {
            $('.media-navigation button.next').removeAttr('disabled');
        }

        getMedia(mediaPage);
    });
    /** End Media Popup Js */

    //removeFeatureImage
    $('.removeSingleImage').on('click', function () {
        let targetId = $(this).data('targetid');
        let target = $('#' + targetId);
        target.find('input').val('');
        target.find('img').remove();
    });

    // addNewTaxonomy
    $('.btnAddNewTaxonomy').on('click', function () {
        let thisBox = $(this).closest('.box-taxonomies');
        let taxonomyName = thisBox.find('input[name=newTaxonomy]').val(),
            module = thisBox.data('taxonomy-module'),
            type = thisBox.data('taxonomy-type'),
            inputName = thisBox.data('input-name');
        if (!taxonomyName) return false;
        $.post('/admin/taxonomies/api/create', {
            module: module,
            type: type,
            name: taxonomyName
        }, function (data, result) {
            console.log(data);
            if (data.status === 'error' || result === 'error') {
                toastr["error"]("", "Thêm thất bại");
                return false;
            }
            let item = data.data;
            thisBox.find('.checkbox-group').append(`<div class="form-group">
                <input type="checkbox" checked id="${item._id}" value="${item._id}" name="${inputName}">
                <label for="${item._id}">${item.name}</label>
            </div>`)
        });
    });
    
    //editSlug
    let Alias = $('#aliasSection'),
        AliasModule = '';
    $('#editSlug').on('click', function () {
        AliasModule = $(this).data('module');
        Alias.find('input').removeAttr('readonly');
        Alias.find('button').remove();
        Alias.append('<button type="button" class="btn btn-sm btn-default btn-save mt5">Lưu</button>' +
            '<button type="button" class="btn btn-sm btn-default btn-cancel mt5 ml5">Hủy</button>');
        return false;
    });
    Alias.on('click', 'button.btn-cancel', function () {
        Alias.find('button').remove();
        Alias.find('input').attr('readonly', true);
    });
    Alias.on('click', 'button.btn-save', function () {
        $.post(`/admin/${AliasModule}/api/changeSlug`, {
            itemId: Alias.closest('form').find('input[name=itemId]').val(),
            slug: Alias.find('input[name=slug]').val()
        }, function (response, result) {
            if (response.status === 'error' || result === 'error') {
                toastr['error']('', response.message || 'Xảy ra lỗi');
                Alias.find('button.btn-cancel').trigger('click');
                return false;
            } else {
                Alias.find('input[name=slug]').val(response.data.slug);
                Alias.find('button.btn-cancel').trigger('click');
                toastr['success']('', response.message);
                return true;
            }
        });
    });

    //changePasswordModal
    let changePasswordModal = $('#changePasswordModal');
    $('#btnSubmitChangePassword').on('click', function () {
        let Form = $(this).closest('form'),
            Message = $('#changePasswordMessage');
        let userId = Form.find('input[name=userId]').val(),
            oldPassword = Form.find('input[name=oldPassword]').val(),
            newPassword = Form.find('input[name=newPassword]').val(),
            newPassword2 = Form.find('input[name=newPassword2]').val();

        if (!userId || !oldPassword || !newPassword || !newPassword2) {
            Message.removeClass('hidden').prepend('Vui Lòng nhập tất cả thông tin');
            return false;
        }

        $.post('/admin/users/change-password', {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword,
            newPassword2: newPassword2
        }, function (data, status) {
            if (data.status === 'error' || status === 'error') {
                console.log(data);
                Message.removeClass('hidden').empty();
                if (data.errCode === 'VALIDATION_ERRORS'){
                    for (let msg of data.errors){
                        Message.prepend('<p>' + msg.msg + '</p>');
                    }
                } else {
                    Message.prepend(data.message || 'Xảy ra lỗi, vui lòng tải lại trang và thử lại!');
                }
            } else {
                $('#changePasswordModal').modal('hide');
                Message.addClass('hidden');
                toastr['success']('', 'Đổi mật khẩu thành công!');
            }
        })
    });
    changePasswordModal.on('show.bs.modal', function () {
        $('#changePasswordMessage').addClass('hidden');
        changePasswordModal.find('input').val('');
    })

});