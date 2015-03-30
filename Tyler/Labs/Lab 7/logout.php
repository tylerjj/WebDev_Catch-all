<?php
session_start();
?>
<html>
    <body>
        <?php
            session_destroy();
            echo "<a href=\"login.html\">Leave page</a>";
            echo "<hr><br>";
        ?>
    </body>
</html>