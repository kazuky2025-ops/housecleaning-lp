param(
    [string]$Src = "C:\Users\kazuk\housecleaning-lp\public\images\logo\tokyo-ouchi-migaki-logo-master.png",
    [string]$OutHeader = "C:\Users\kazuk\housecleaning-lp\public\images\logo\tokyo-ouchi-migaki-logo-header.png",
    [string]$OutFooter = "C:\Users\kazuk\housecleaning-lp\public\images\logo\tokyo-ouchi-migaki-logo-footer.png"
)

Add-Type -AssemblyName System.Drawing

# Footer "navy -> bright" target color
$WHITE = @(0xFA, 0xF8, 0xF2)

$bmp = New-Object System.Drawing.Bitmap($Src)
$w = $bmp.Width; $h = $bmp.Height
Write-Output "Source: ${w}x${h}"

$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$srcBytes = New-Object byte[] ($data.Stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $srcBytes, 0, $srcBytes.Length)
$bmp.UnlockBits($data)
$stride = $data.Stride
$bmp.Dispose()

# ---- Tight bbox of real content (alpha > 10) + small safety margin ----
$THR = 10
$minX=$w; $maxX=-1; $minY=$h; $maxY=-1
for ($y=0; $y -lt $h; $y++) {
    $rowOff = $y*$stride
    for ($x=0; $x -lt $w; $x++) {
        $a = $srcBytes[$rowOff + $x*4 + 3]
        if ($a -gt $THR) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
$MARGIN = 10
$minX = [Math]::Max(0, $minX - $MARGIN); $minY = [Math]::Max(0, $minY - $MARGIN)
$maxX = [Math]::Min($w-1, $maxX + $MARGIN); $maxY = [Math]::Min($h-1, $maxY + $MARGIN)
$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1
Write-Output "Crop: x=$minX y=$minY w=$cropW h=$cropH"

function Save-Crop([string]$outPath, [bool]$recolorNavyToWhite) {
    $out = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
    $outData = $out.LockBits($outRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outStride = $outData.Stride
    $outBytes = New-Object byte[] ($outStride * $cropH)

    for ($oy = 0; $oy -lt $cropH; $oy++) {
        $sy = $oy + $minY
        $srcRowOff = $sy * $stride
        $outRowOff = $oy * $outStride
        for ($ox = 0; $ox -lt $cropW; $ox++) {
            $sx = $ox + $minX
            $sOff = $srcRowOff + $sx * 4
            $b = $srcBytes[$sOff]; $g = $srcBytes[$sOff+1]; $r = $srcBytes[$sOff+2]; $a = $srcBytes[$sOff+3]
            $outOff = $outRowOff + $ox * 4

            if (-not $recolorNavyToWhite -or $a -eq 0) {
                # Header: exact copy, palette untouched. Footer: fully-transparent
                # pixels also pass straight through (nothing to recolor).
                $outBytes[$outOff] = $b; $outBytes[$outOff+1] = $g; $outBytes[$outOff+2] = $r; $outBytes[$outOff+3] = $a
            } else {
                # Footer: blend dark navy -> bright white, smoothly, based on how
                # dark the pixel is. Brand cyan/blue spray (already bright) is
                # left at or near its original color, matching the gradient the
                # artwork already has instead of a hard color-swap seam.
                $mx = $r; if ($g -gt $mx) { $mx = $g }; if ($b -gt $mx) { $mx = $b }
                $whiteAmt = 1.0 - ([Math]::Max(0.0, [Math]::Min(1.0, ($mx - 80.0) / 40.0)))
                $nr = [int]($r * (1 - $whiteAmt) + $WHITE[0] * $whiteAmt)
                $ng = [int]($g * (1 - $whiteAmt) + $WHITE[1] * $whiteAmt)
                $nb = [int]($b * (1 - $whiteAmt) + $WHITE[2] * $whiteAmt)
                $outBytes[$outOff] = [byte]$nb; $outBytes[$outOff+1] = [byte]$ng; $outBytes[$outOff+2] = [byte]$nr; $outBytes[$outOff+3] = $a
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $outData.Scan0, $outBytes.Length)
    $out.UnlockBits($outData)
    $out.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $out.Dispose()
    Write-Output "Saved: $outPath ($cropW x $cropH)"
}

Save-Crop -outPath $OutHeader -recolorNavyToWhite $false
Save-Crop -outPath $OutFooter -recolorNavyToWhite $true

Write-Output "Done."
