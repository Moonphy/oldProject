<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/16
 * Time: 下午2:12
 */

namespace Modules\Form\Backend;


class EntryModel extends \Modules\Form\EntryModel
{
    public function __construct(EntryRepo $repo, $formId)
    {
        parent::__construct($repo, $formId);
    }

    public function getEntries($page = 1, $limit = 20)
    {
        return $this->repo->paginate($page, $limit, ['form_id' => $this->formId]);
    }

}