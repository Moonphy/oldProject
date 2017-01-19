<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/16
 * Time: 上午9:56
 */

namespace Modules\Form;


class EntryModel
{
    /**
     * @var FormRepo
     */
    protected $repo;
    protected $formId;

    public function __construct(EntryRepo $repo, $formId)
    {
        $this->repo = $repo;
        $this->formId = $formId;
    }

    public function create(array $data)
    {
        $data['form_id'] = $this->formId;
        return $this->repo->create($data);
    }

}