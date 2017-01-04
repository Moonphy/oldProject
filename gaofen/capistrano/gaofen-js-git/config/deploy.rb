set :application, 'gaofen-js-git'
set :repo_url, 'ssh://git@gitlab.gaofen.com:10022/frontend/gaofen-js.git'
# set :git_enable_submodules, 1

# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

#set :branch, 'master'
#set :branch, 'feature/giveCoin'
#set :branch, 'feature/littleFun'
#set :branch, 'feature/lectures'
#set :branch, 'feature/huodong'
set :branch, 'hotfix/xuexiao-mobi'
#set :branch, 'feature/docspecialPPT'
#set :branch, 'feature/ziliao-detail-diaocha'

set :deploy_to, '/home/wwwroot/gaofen/gaofen-js-git'
# set :scm, :git

# set :format, :pretty
# set :log_level, :debug
# set :pty, true

# set :linked_files, %w{conf/application.ini}
# set :linked_dirs, %w{app/storage/cache app/storage/logs app/storage/sessions app/storage/views  vendor}

# set :default_env, { path: "/opt/ruby/bin:$PATH" }
set :keep_releases, 5

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      # execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

  after :finishing, 'deploy:cleanup'

  # desc 'composer install'
  # task :composer_install do
  #   on roles(:web) do
  #     within release_path do
  #        execute "cd #{release_path};composer install"
  #     end
  #   end
  # end
  # after :updated, 'deploy:composer_install'

  # desc 'Bower install'
  # task :bower_install do
  #   on roles(:web) do
  #     within release_path do
  #       execute "cd #{release_path}/public;bower install --allow-root"
  #     end
  #   end
  # end
  # after :updated, 'deploy:bower_install'

end
