!macro customInstall
  DeleteRegKey HKCR "lyxteacher"
  WriteRegStr HKCR "lyxteacher" "" "URL:lyxteacher"
  WriteRegStr HKCR "lyxteacher" "URL Protocol" ""
  WriteRegStr HKCR "lyxteacher\shell" "" ""
  WriteRegStr HKCR "lyxteacher\shell\Open" "" ""
  WriteRegStr HKCR "lyxteacher\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "lyxteacher"
!macroend