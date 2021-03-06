require 'fileutils'

# Add these directories to the loadpath
%w{ observers middleware }.each do |dir|
 ActiveSupport::Dependencies.load_paths << (Skyline.root + "app" + dir).to_s
end

# Vendor paths
vendor_path = (Skyline.root + "vendor").to_s
application_vendor_index = $LOAD_PATH.index(Rails.root + "vendor") || 0
$LOAD_PATH.insert(application_vendor_index + 1, vendor_path)
ActiveSupport::Dependencies.load_paths << vendor_path
ActiveSupport::Dependencies.load_once_paths << vendor_path

# Setup public paths
public_path = Pathname.new(Rails.public_path) + "skyline"
unless public_path.exist? 
  FileUtils.rm(public_path) if public_path.symlink?
  
  puts "=> Skyline: Creating assets symlink to '#{public_path}'"
  FileUtils.ln_s((Skyline.root + "public/skyline").relative_path_from(Pathname.new(Rails.public_path)),public_path)
end

# Load our own plugin initializers
Dir[Skyline.root + "config/initializers/*.rb"].sort.each do |file|
 require file
end

Skyline::PluginsManager.init_all!
if Rails.configuration.cache_classes || !Rails.configuration.reload_plugins
  Skyline::PluginsManager.load_all!
end
