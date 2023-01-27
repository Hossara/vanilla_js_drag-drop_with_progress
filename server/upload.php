<?php
if(isset($_FILES['file']))
{
    echo $_FILES['file']['tmp_name'];
    echo "....";
    $file_name = $_FILES['file']['name'];
    $file_size = $_FILES['file']['size'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_type= $_FILES['file']['type'];

    if($file_size > 2097152) echo 'Your file is too large!';
    else
    {
        move_uploaded_file($file_tmp, "./files/" . $file_name);
        echo "Success";
    }
}