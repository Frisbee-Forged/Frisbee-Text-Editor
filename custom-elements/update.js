function updatetitle(versionName) {
 subtitle = document.getElementById('subtitle')
  
  document.title = "Frisbee " + versionName;
  subtitle.textContent = subtitle.textContent + versionName;
 
}
const versionName = "(Github Pages)";
updatetitle(versionName);
