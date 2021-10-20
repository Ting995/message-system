// 路径导航部分
$('.list').find('.panel-title').click(function () {
    $('.local-2').text($(this).text())
});
$('.list').find('.panel-body').click(function () {
    $('.local-3').text($(this).text())
})
// 点击删除
$('.delete-btn').on('click', function () {
    $('#deleId').val($(this).attr('data-id'))
})