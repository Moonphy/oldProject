# config valid only for Capistrano 3.1
#lock '3.1.0'

#set :application, 'js'
set :application, 'weixin-static-git'
#set :repo_url, 'ssh://git@pcblaze.gicp.net:10022/frontend/v6-static.git'
set :repo_url, 'ssh://git@gitlab.gaofen.com:10022/weixin/static.git'
#set :repo_url, 'ssh://git@gaofen.asuscomm.com:10022/frontend/v6-static.git'
#set :repo_url, 'git@gaofen.mooo.com:frontend/v6-static.git'
#set :repo_url, 'git@gaofen.asuscomm.com:frontend/v6-static.git'
#set :repo_url, 'git@gaofencom.gnway.cc:frontend/gaofen-static-v3.git'

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }
#set :branch, 'release/1.0'
#set :branch, 'feature/ppt-preview'
#set :branch, 'feature/some-optimization '

# Default deploy_to directory is /var/www/my_app
#set :deploy_to, '/data2/wwwroot/form-static'
set :deploy_to, '/home/wwwroot/gaofen/weixin-static-git'

# Default value for :scm is :git
# set :scm, :git
#set :scm, :svn

#set :svn_username, 'heli'
#set :svn_password, 'huangheli'

#set :user, 'root'

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
#set :linked_dirs, %w{static/v3 static/v5}
#set :linked_dirs, %w{js}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
