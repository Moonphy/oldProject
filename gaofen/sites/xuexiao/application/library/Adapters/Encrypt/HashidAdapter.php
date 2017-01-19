<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/29
 * Time: 下午5:14
 */

namespace Adapters\Encrypt;


use Hashids\Hashids;

class HashidAdapter implements EncryptInterface
{
    /**
     * @var Hashids
     */
    protected $crypter;

    public function __construct(Hashids $crypter)
    {
        $this->crypter = $crypter;
    }

    protected function getCrypter()
    {
        return $this->crypter;
    }

    /**
     * Encodes a variable number of parameters to generate a hash
     *
     * @param mixed ...
     *
     * @return string the generated hash
     */
    public function encode()
    {
        return call_user_func_array([$this->crypter, 'encode'], func_get_args());
    }

    /**
     * Decodes a hash to the original parameter values
     *
     * @param string $hash the hash to decode
     *
     * @return array
     */
    public function decode($hash)
    {
        return $this->crypter->decode($hash);
    }

    /**
     * Encodes hexadecimal values to generate a hash
     *
     * @param string $str hexadecimal string
     *
     * @return string the generated hash
     */
    public function encode_hex($str)
    {
        return $this->crypter->encode_hex($str);
    }

    /**
     * Decodes hexadecimal hash
     *
     * @param string $hash
     *
     * @return string hexadecimal string
     */
    public function decode_hex($hash)
    {
        return $this->crypter->decode_hex($hash);
    }
}